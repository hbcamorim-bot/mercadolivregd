import {
  ActivationStatus,
  AgreementStatus,
  CommissionStatus,
  CommissionType,
  EntityMembershipStatus,
  MatchStatus,
  PlantStatus,
  Prisma,
  ProposalStatus,
  QualificationStatus,
  QuotaStatus,
  ReservationStatus,
} from "@prisma/client"
import { NextResponse } from "next/server"
import { z } from "zod"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { calculateAvailableCapacity, canReserveCapacity } from "@/lib/domain/capacity"
import { calculateCommission } from "@/lib/domain/commission"
import { evaluateMatch } from "@/lib/domain/matching"
import { prisma } from "@/lib/db"
import { checkRateLimit, getRequestClientKey } from "@/lib/rate-limit"
import {
  commercialPartnerSchema,
  consumerUnitSchema,
  generatorPlantSchema,
  prospectSchema,
  supplierOrganizationSchema,
} from "@/lib/validation/mvp"

const id = z.string().trim().min(1)
const optionalText = z.string().trim().max(500).optional()

const actionEnvelopeSchema = z.object({
  action: z.string().trim().min(1),
  payload: z.unknown(),
})

const utilitySchema = z.object({
  name: z.string().trim().min(2).max(160),
  code: z.string().trim().min(2).max(40).transform((value) => value.toUpperCase()),
})

const entitySchema = z.object({
  supplierOrganizationId: id,
  type: z.enum(["ASSOCIATION", "COOPERATIVE", "CONSORTIUM", "OTHER"]),
  name: z.string().trim().min(2).max(160),
  legalName: optionalText,
  documentNumber: optionalText,
})

const plantWithCapacitySchema = generatorPlantSchema.extend({
  operationalKwh: z.coerce.number().finite().positive(),
  contractedKwh: z.coerce.number().finite().nonnegative().default(0),
  safetyMarginKwh: z.coerce.number().finite().nonnegative().default(0),
  referenceMonth: z.coerce.date(),
})

const prospectWithUnitSchema = prospectSchema.extend({
  consumerUnit: consumerUnitSchema.omit({ prospectId: true }),
})

const commissionPolicySchema = z
  .object({
    supplierOrganizationId: id,
    name: z.string().trim().min(2).max(120),
    type: z.nativeEnum(CommissionType),
    fixedAmount: z.coerce.number().finite().nonnegative().optional(),
    percentage: z.coerce.number().finite().min(0).max(100).optional(),
    recurringMonths: z.coerce.number().int().positive().max(60).optional(),
  })
  .superRefine((value, context) => {
    if (value.type === CommissionType.PERCENTAGE_OF_LEASE && value.percentage === undefined) {
      context.addIssue({ code: "custom", path: ["percentage"], message: "Informe o percentual." })
    }
    if (value.type !== CommissionType.PERCENTAGE_OF_LEASE && value.fixedAmount === undefined) {
      context.addIssue({ code: "custom", path: ["fixedAmount"], message: "Informe o valor fixo." })
    }
  })

const proposalActionSchema = z.object({
  matchId: id,
  monthlyLeaseAmount: z.coerce.number().finite().positive(),
  estimatedMonthlySavings: z.coerce.number().finite().nonnegative().optional(),
  estimatedSavingsPercent: z.coerce.number().finite().min(0).max(100).optional(),
  validDays: z.coerce.number().int().min(1).max(90).default(15),
})

const activationUpdateSchema = z.object({
  activationProcessId: id,
  status: z.nativeEnum(ActivationStatus),
  protocolNumber: optionalText,
  notes: z.string().trim().max(2000).optional(),
})

function number(value: Prisma.Decimal | number | null | undefined) {
  return value === null || value === undefined ? 0 : Number(value)
}

function startOfCurrentMonth() {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
}

function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setUTCDate(result.getUTCDate() + days)
  return result
}

function apiError(error: unknown) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: "Dados inválidos", details: error.flatten() },
      { status: 400 },
    )
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Já existe um registro com estes dados." }, { status: 409 })
    }
    if (error.code === "P2021" || error.code === "P2022") {
      return NextResponse.json(
        {
          error: "O banco ainda não recebeu a estrutura do novo MVP.",
          code: "DATABASE_MIGRATION_REQUIRED",
        },
        { status: 503 },
      )
    }
  }

  console.error("[API operations]", error)
  return NextResponse.json({ error: "Não foi possível concluir a operação." }, { status: 500 })
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const [
      suppliers,
      utilities,
      entities,
      plants,
      partners,
      prospects,
      agreements,
      commissionPolicies,
      commissionEntries,
    ] = await Promise.all([
      prisma.organization.findMany({
        where: { type: "SUPPLIER" },
        include: { supplierProfile: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.distributionUtility.findMany({ orderBy: { name: "asc" } }),
      prisma.sharedGenerationEntity.findMany({
        include: { supplierOrganization: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.generatorPlant.findMany({
        include: {
          distributionUtility: { select: { id: true, name: true, code: true } },
          sharedGenerationEntity: { select: { id: true, name: true } },
          supplierOrganization: { select: { id: true, name: true } },
          capacityPeriods: { orderBy: { referenceMonth: "desc" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.commercialPartner.findMany({
        include: {
          supplierOrganization: { select: { id: true, name: true } },
          _count: { select: { prospects: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.prospect.findMany({
        include: {
          currentCommercialPartner: { select: { id: true, name: true } },
          supplierOrganization: { select: { id: true, name: true } },
          consumerUnits: {
            include: {
              distributionUtility: { select: { id: true, name: true, code: true } },
              matches: {
                include: {
                  plant: { select: { id: true, name: true } },
                  reservation: true,
                  proposals: { orderBy: { version: "desc" }, take: 1 },
                },
                orderBy: { createdAt: "desc" },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.quotaLeaseAgreement.findMany({
        include: {
          plant: { select: { id: true, name: true } },
          consumerUnit: { select: { id: true, unitNumber: true } },
          activationProcess: true,
          proposal: { include: { match: { include: { consumerUnit: { include: { prospect: true } } } } } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.commissionPolicy.findMany({
        include: { supplierOrganization: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.commissionEntry.findMany({
        include: {
          commercialPartner: { select: { id: true, name: true } },
          prospect: { select: { id: true, name: true } },
          agreement: { select: { id: true, status: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
    ])

    const summary = {
      suppliers: suppliers.length,
      plants: plants.length,
      operationalPlants: plants.filter((plant) => plant.status === PlantStatus.OPERATIONAL).length,
      partners: partners.length,
      prospects: prospects.length,
      activeAgreements: agreements.filter((agreement) => agreement.status === AgreementStatus.ACTIVE).length,
      availableKwh: plants.reduce(
        (total, plant) => total + number(plant.capacityPeriods[0]?.availableKwh),
        0,
      ),
      reservedKwh: plants.reduce(
        (total, plant) => total + number(plant.capacityPeriods[0]?.reservedKwh),
        0,
      ),
      pendingCommission: commissionEntries
        .filter((entry) => entry.status !== CommissionStatus.PAID)
        .reduce((total, entry) => total + number(entry.amount), 0),
    }

    return NextResponse.json({
      summary,
      suppliers,
      utilities,
      entities,
      plants,
      partners,
      prospects,
      agreements,
      commissionPolicies,
      commissionEntries,
    })
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const limit = checkRateLimit(`admin-operation:${getRequestClientKey(request)}`, 180, 60 * 1000)
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Muitas operações em sequência." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    )
  }

  try {
    const envelope = actionEnvelopeSchema.parse(await request.json())

    switch (envelope.action) {
      case "createSupplier": {
        const payload = supplierOrganizationSchema.parse(envelope.payload)
        const supplier = await prisma.organization.create({
          data: {
            name: payload.name,
            legalName: payload.legalName || null,
            documentNumber: payload.documentNumber,
            type: "SUPPLIER",
            status: "PENDING_REVIEW",
            supplierProfile: {
              create: {
                contactName: payload.contactName,
                contactEmail: payload.contactEmail,
                contactPhone: payload.contactPhone,
                responsibilityAcceptedAt: new Date(),
                responsibilityVersion: payload.responsibilityVersion,
              },
            },
          },
        })
        return NextResponse.json({ success: true, id: supplier.id }, { status: 201 })
      }

      case "createUtility": {
        const payload = utilitySchema.parse(envelope.payload)
        const utility = await prisma.distributionUtility.create({ data: payload })
        return NextResponse.json({ success: true, id: utility.id }, { status: 201 })
      }

      case "createEntity": {
        const payload = entitySchema.parse(envelope.payload)
        const entity = await prisma.sharedGenerationEntity.create({
          data: {
            ...payload,
            legalName: payload.legalName || null,
            documentNumber: payload.documentNumber || null,
            qualificationStatus: QualificationStatus.DOCUMENTS_PENDING,
          },
        })
        return NextResponse.json({ success: true, id: entity.id }, { status: 201 })
      }

      case "createPlant": {
        const payload = plantWithCapacitySchema.parse(envelope.payload)
        const entity = await prisma.sharedGenerationEntity.findUnique({
          where: { id: payload.sharedGenerationEntityId },
        })
        if (!entity || entity.supplierOrganizationId !== payload.supplierOrganizationId) {
          return NextResponse.json({ error: "Entidade incompatível com o fornecedor." }, { status: 409 })
        }

        const availableKwh = calculateAvailableCapacity({
          operationalKwh: payload.operationalKwh,
          contractedKwh: payload.contractedKwh,
          reservedKwh: 0,
          safetyMarginKwh: payload.safetyMarginKwh,
        })
        const plant = await prisma.generatorPlant.create({
          data: {
            supplierOrganizationId: payload.supplierOrganizationId,
            sharedGenerationEntityId: payload.sharedGenerationEntityId,
            distributionUtilityId: payload.distributionUtilityId,
            name: payload.name,
            internalCode: payload.internalCode,
            generationUnitNumber: payload.generationUnitNumber || null,
            city: payload.city,
            state: payload.state,
            source: payload.source,
            installedPowerKw: payload.installedPowerKw,
            averageMonthlyGenerationKwh: payload.averageMonthlyGenerationKwh,
            status: PlantStatus.UNDER_REVIEW,
            qualificationStatus: QualificationStatus.DOCUMENTS_PENDING,
            capacityPeriods: {
              create: {
                referenceMonth: payload.referenceMonth,
                operationalKwh: payload.operationalKwh,
                contractedKwh: payload.contractedKwh,
                reservedKwh: 0,
                safetyMarginKwh: payload.safetyMarginKwh,
                availableKwh,
              },
            },
          },
        })
        return NextResponse.json({ success: true, id: plant.id }, { status: 201 })
      }

      case "qualifyPlant": {
        const payload = z.object({ plantId: id }).parse(envelope.payload)
        const plant = await prisma.generatorPlant.update({
          where: { id: payload.plantId },
          data: {
            status: PlantStatus.OPERATIONAL,
            qualificationStatus: QualificationStatus.APPROVED_FOR_PUBLICATION,
            sharedGenerationEntity: {
              update: { qualificationStatus: QualificationStatus.APPROVED_FOR_PUBLICATION },
            },
            supplierOrganization: { update: { status: "ACTIVE" } },
          },
        })
        return NextResponse.json({ success: true, id: plant.id })
      }

      case "createPartner": {
        const payload = commercialPartnerSchema.parse(envelope.payload)
        const partner = await prisma.commercialPartner.create({
          data: {
            supplierOrganizationId: payload.supplierOrganizationId,
            name: payload.name,
            documentNumber: payload.documentNumber || null,
            email: payload.email || null,
            phone: payload.phone || null,
            status: "ACTIVE",
          },
        })
        return NextResponse.json({ success: true, id: partner.id }, { status: 201 })
      }

      case "createProspect": {
        const payload = prospectWithUnitSchema.parse(envelope.payload)
        const partner = await prisma.commercialPartner.findUnique({
          where: { id: payload.currentCommercialPartnerId },
        })
        if (!partner || partner.supplierOrganizationId !== payload.supplierOrganizationId) {
          return NextResponse.json({ error: "Parceiro incompatível com o fornecedor." }, { status: 409 })
        }

        const prospect = await prisma.prospect.create({
          data: {
            supplierOrganizationId: payload.supplierOrganizationId,
            currentCommercialPartnerId: payload.currentCommercialPartnerId,
            name: payload.name,
            documentNumber: payload.documentNumber || null,
            email: payload.email || null,
            phone: payload.phone || null,
            source: payload.source || null,
            notes: payload.notes || null,
            status: "QUALIFIED",
            consentAt: new Date(),
            consentVersion: payload.consentVersion,
            leadOwnerships: {
              create: { commercialPartnerId: payload.currentCommercialPartnerId },
            },
            consentRecords: {
              create: {
                type: "DATA_PROCESSING",
                version: payload.consentVersion,
                grantedAt: new Date(),
                source: "ADMIN_PORTAL",
              },
            },
            consumerUnits: {
              create: {
                ...payload.consumerUnit,
                customerClass: payload.consumerUnit.customerClass || null,
                tariffGroup: payload.consumerUnit.tariffGroup || null,
                connectionType: payload.consumerUnit.connectionType || null,
              },
            },
          },
        })
        return NextResponse.json({ success: true, id: prospect.id }, { status: 201 })
      }

      case "createMatch": {
        const payload = z.object({ consumerUnitId: id, plantId: id }).parse(envelope.payload)
        const [consumerUnit, plant] = await Promise.all([
          prisma.consumerUnit.findUnique({
            where: { id: payload.consumerUnitId },
            include: { prospect: true },
          }),
          prisma.generatorPlant.findUnique({
            where: { id: payload.plantId },
            include: { capacityPeriods: { orderBy: { referenceMonth: "desc" }, take: 1 } },
          }),
        ])
        if (!consumerUnit || !plant) {
          return NextResponse.json({ error: "Usina ou unidade consumidora não encontrada." }, { status: 404 })
        }
        if (consumerUnit.prospect.supplierOrganizationId !== plant.supplierOrganizationId) {
          return NextResponse.json({ error: "Usina e prospect pertencem a fornecedores diferentes." }, { status: 409 })
        }

        const capacity = plant.capacityPeriods[0]
        const evaluation = evaluateMatch({
          consumerUtilityId: consumerUnit.distributionUtilityId,
          plantUtilityId: plant.distributionUtilityId,
          averageMonthlyConsumptionKwh: number(consumerUnit.averageMonthlyConsumptionKwh),
          availableKwh: number(capacity?.availableKwh),
          plantOperational: plant.status === PlantStatus.OPERATIONAL,
          plantQualified: plant.qualificationStatus === QualificationStatus.APPROVED_FOR_PUBLICATION,
        })
        if (!evaluation.eligible || !capacity) {
          return NextResponse.json(
            { error: "Combinação não elegível.", reasons: evaluation.reasonCodes },
            { status: 409 },
          )
        }

        const match = await prisma.match.create({
          data: {
            consumerUnitId: consumerUnit.id,
            plantId: plant.id,
            capacityPeriodId: capacity.id,
            suggestedKwh: evaluation.suggestedKwh,
            score: evaluation.score,
            rationale: { reasons: evaluation.reasonCodes, coverageRatio: 0.85 },
            status: MatchStatus.REVIEWED,
            expiresAt: addDays(new Date(), 14),
          },
        })
        await prisma.prospect.update({ where: { id: consumerUnit.prospectId }, data: { status: "MATCHED" } })
        return NextResponse.json({ success: true, id: match.id }, { status: 201 })
      }

      case "reserveMatch": {
        const payload = z.object({ matchId: id }).parse(envelope.payload)
        const reservation = await prisma.$transaction(
          async (transaction) => {
            const match = await transaction.match.findUnique({
              where: { id: payload.matchId },
              include: { reservation: true, capacityPeriod: true },
            })
            if (!match || !match.capacityPeriod) throw new Error("MATCH_NOT_FOUND")
            if (match.reservation) throw new Error("MATCH_ALREADY_RESERVED")

            const capacity = match.capacityPeriod
            const availableKwh = calculateAvailableCapacity({
              operationalKwh: number(capacity.operationalKwh),
              contractedKwh: number(capacity.contractedKwh),
              reservedKwh: number(capacity.reservedKwh),
              safetyMarginKwh: number(capacity.safetyMarginKwh),
            })
            const requestedKwh = number(match.suggestedKwh)
            if (!canReserveCapacity(availableKwh, requestedKwh)) {
              throw new Error("CAPACITY_UNAVAILABLE")
            }

            const newReservedKwh = number(capacity.reservedKwh) + requestedKwh
            const newAvailableKwh = calculateAvailableCapacity({
              operationalKwh: number(capacity.operationalKwh),
              contractedKwh: number(capacity.contractedKwh),
              reservedKwh: newReservedKwh,
              safetyMarginKwh: number(capacity.safetyMarginKwh),
            })

            await transaction.capacityPeriod.update({
              where: { id: capacity.id },
              data: { reservedKwh: newReservedKwh, availableKwh: newAvailableKwh },
            })
            await transaction.match.update({ where: { id: match.id }, data: { status: MatchStatus.RESERVED } })
            return transaction.capacityReservation.create({
              data: {
                matchId: match.id,
                plantId: match.plantId,
                consumerUnitId: match.consumerUnitId,
                capacityPeriodId: capacity.id,
                reservedKwh: requestedKwh,
                expiresAt: addDays(new Date(), 7),
              },
            })
          },
          { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        )
        return NextResponse.json({ success: true, id: reservation.id }, { status: 201 })
      }

      case "createProposal": {
        const payload = proposalActionSchema.parse(envelope.payload)
        const match = await prisma.match.findUnique({
          where: { id: payload.matchId },
          include: { reservation: true, proposals: { orderBy: { version: "desc" }, take: 1 } },
        })
        if (!match || match.reservation?.status !== ReservationStatus.ACTIVE) {
          return NextResponse.json({ error: "Reserve a capacidade antes de criar a proposta." }, { status: 409 })
        }

        const proposal = await prisma.proposal.create({
          data: {
            matchId: match.id,
            consumerUnitId: match.consumerUnitId,
            version: (match.proposals[0]?.version ?? 0) + 1,
            status: ProposalStatus.SENT,
            quotaKwh: match.suggestedKwh,
            monthlyLeaseAmount: payload.monthlyLeaseAmount,
            estimatedMonthlySavings: payload.estimatedMonthlySavings,
            estimatedSavingsPercent: payload.estimatedSavingsPercent,
            validUntil: addDays(new Date(), payload.validDays),
            sentAt: new Date(),
            terms: {
              model: "PLANT_QUOTA_LEASE",
              platformRole: "WORKFLOW_AND_MATCHING",
              supplierResponsibility: true,
            },
          },
        })
        await prisma.prospect.update({
          where: { id: (await prisma.consumerUnit.findUniqueOrThrow({ where: { id: match.consumerUnitId } })).prospectId },
          data: { status: "PROPOSAL_SENT" },
        })
        return NextResponse.json({ success: true, id: proposal.id }, { status: 201 })
      }

      case "acceptProposal": {
        const payload = z.object({ proposalId: id }).parse(envelope.payload)
        const agreement = await prisma.$transaction(
          async (transaction) => {
            const proposal = await transaction.proposal.findUnique({
              where: { id: payload.proposalId },
              include: {
                agreement: true,
                match: {
                  include: {
                    reservation: true,
                    plant: true,
                    consumerUnit: { include: { prospect: true } },
                  },
                },
              },
            })
            if (!proposal || proposal.agreement) throw new Error("PROPOSAL_UNAVAILABLE")
            if (proposal.status !== ProposalStatus.SENT && proposal.status !== ProposalStatus.VIEWED) {
              throw new Error("PROPOSAL_UNAVAILABLE")
            }

            const { plant, consumerUnit, reservation } = proposal.match
            if (!reservation || reservation.status !== ReservationStatus.ACTIVE) {
              throw new Error("RESERVATION_UNAVAILABLE")
            }

            const membership = await transaction.associationMembership.upsert({
              where: {
                sharedGenerationEntityId_consumerUnitId: {
                  sharedGenerationEntityId: plant.sharedGenerationEntityId,
                  consumerUnitId: consumerUnit.id,
                },
              },
              update: { status: EntityMembershipStatus.PENDING },
              create: {
                sharedGenerationEntityId: plant.sharedGenerationEntityId,
                prospectId: consumerUnit.prospectId,
                consumerUnitId: consumerUnit.id,
                status: EntityMembershipStatus.PENDING,
              },
            })

            const createdAgreement = await transaction.quotaLeaseAgreement.create({
              data: {
                proposalId: proposal.id,
                plantId: plant.id,
                consumerUnitId: consumerUnit.id,
                sharedGenerationEntityId: plant.sharedGenerationEntityId,
                associationMembershipId: membership.id,
                status: AgreementStatus.SIGNATURE_PENDING,
                quotaKwh: proposal.quotaKwh,
                monthlyLeaseAmount: proposal.monthlyLeaseAmount,
                quota: {
                  create: {
                    plantId: plant.id,
                    consumerUnitId: consumerUnit.id,
                    quotaKwh: proposal.quotaKwh,
                    status: QuotaStatus.CONTRACTED,
                    reservedAt: reservation.createdAt,
                    contractedAt: new Date(),
                  },
                },
                activationProcess: {
                  create: {
                    consumerUnitId: consumerUnit.id,
                    distributionUtilityId: consumerUnit.distributionUtilityId,
                    status: ActivationStatus.DOCUMENTS_PENDING,
                  },
                },
              },
            })

            await transaction.proposal.update({
              where: { id: proposal.id },
              data: { status: ProposalStatus.ACCEPTED, acceptedAt: new Date() },
            })
            await transaction.capacityReservation.update({
              where: { id: reservation.id },
              data: { status: ReservationStatus.CONVERTED },
            })
            if (reservation.capacityPeriodId) {
              await transaction.capacityPeriod.update({
                where: { id: reservation.capacityPeriodId },
                data: {
                  reservedKwh: { decrement: proposal.quotaKwh },
                  contractedKwh: { increment: proposal.quotaKwh },
                },
              })
            }
            await transaction.prospect.update({
              where: { id: consumerUnit.prospectId },
              data: { status: "CONTRACT_PENDING" },
            })

            const policy = await transaction.commissionPolicy.findFirst({
              where: { supplierOrganizationId: plant.supplierOrganizationId, active: true },
              orderBy: { createdAt: "desc" },
            })
            if (policy) {
              const amount = calculateCommission(
                policy.type === CommissionType.PERCENTAGE_OF_LEASE
                  ? {
                      type: policy.type,
                      monthlyLeaseAmount: number(proposal.monthlyLeaseAmount),
                      percentage: number(policy.percentage),
                    }
                  : { type: policy.type, fixedAmount: number(policy.fixedAmount) },
              )
              await transaction.commissionEntry.create({
                data: {
                  commercialPartnerId: consumerUnit.prospect.currentCommercialPartnerId,
                  prospectId: consumerUnit.prospectId,
                  agreementId: createdAgreement.id,
                  policyId: policy.id,
                  amount,
                  competence: startOfCurrentMonth(),
                },
              })
            }

            return createdAgreement
          },
          { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        )
        return NextResponse.json({ success: true, id: agreement.id }, { status: 201 })
      }

      case "updateActivation": {
        const payload = activationUpdateSchema.parse(envelope.payload)
        const result = await prisma.$transaction(async (transaction) => {
          const activation = await transaction.activationProcess.update({
            where: { id: payload.activationProcessId },
            data: {
              status: payload.status,
              protocolNumber: payload.protocolNumber || undefined,
              notes: payload.notes || undefined,
              submittedAt:
                payload.status === ActivationStatus.SUBMITTED ? new Date() : undefined,
              activatedAt:
                payload.status === ActivationStatus.ACTIVATED ? new Date() : undefined,
            },
            include: { agreement: { include: { consumerUnit: true } } },
          })

          if (payload.status === ActivationStatus.READY_TO_SUBMIT) {
            await transaction.quotaLeaseAgreement.update({
              where: { id: activation.agreementId },
              data: { status: AgreementStatus.SIGNED, signedAt: new Date() },
            })
            if (activation.agreement.associationMembershipId) {
              await transaction.associationMembership.update({
                where: { id: activation.agreement.associationMembershipId },
                data: { status: EntityMembershipStatus.ACTIVE, joinedAt: new Date() },
              })
            }
          }

          if (payload.status === ActivationStatus.ACTIVATED) {
            await transaction.quotaLeaseAgreement.update({
              where: { id: activation.agreementId },
              data: { status: AgreementStatus.ACTIVE, startsAt: new Date() },
            })
            await transaction.plantQuota.update({
              where: { agreementId: activation.agreementId },
              data: { status: QuotaStatus.ACTIVE, activeAt: new Date() },
            })
            await transaction.prospect.update({
              where: { id: activation.agreement.consumerUnit.prospectId },
              data: { status: "ACTIVE" },
            })
            await transaction.commissionEntry.updateMany({
              where: { agreementId: activation.agreementId, status: CommissionStatus.PENDING },
              data: { status: CommissionStatus.ELIGIBLE, eligibleAt: new Date() },
            })
          }
          return activation
        })
        return NextResponse.json({ success: true, id: result.id })
      }

      case "createCommissionPolicy": {
        const payload = commissionPolicySchema.parse(envelope.payload)
        const policy = await prisma.$transaction(async (transaction) => {
          await transaction.commissionPolicy.updateMany({
            where: { supplierOrganizationId: payload.supplierOrganizationId, active: true },
            data: { active: false },
          })
          return transaction.commissionPolicy.create({
            data: {
              supplierOrganizationId: payload.supplierOrganizationId,
              name: payload.name,
              type: payload.type,
              fixedAmount: payload.fixedAmount,
              percentage: payload.percentage,
              recurringMonths: payload.recurringMonths,
            },
          })
        })
        return NextResponse.json({ success: true, id: policy.id }, { status: 201 })
      }

      default:
        return NextResponse.json({ error: "Ação desconhecida." }, { status: 400 })
    }
  } catch (error) {
    if (error instanceof Error) {
      const conflictMessages: Record<string, string> = {
        MATCH_NOT_FOUND: "Matching não encontrado.",
        MATCH_ALREADY_RESERVED: "Este matching já possui reserva.",
        CAPACITY_UNAVAILABLE: "A capacidade disponível mudou e não comporta a reserva.",
        PROPOSAL_UNAVAILABLE: "A proposta não está disponível para aceite.",
        RESERVATION_UNAVAILABLE: "A reserva expirou ou não está mais disponível.",
      }
      if (conflictMessages[error.message]) {
        return NextResponse.json({ error: conflictMessages[error.message] }, { status: 409 })
      }
    }
    return apiError(error)
  }
}
