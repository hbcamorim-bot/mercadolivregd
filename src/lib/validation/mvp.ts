import { z } from 'zod'

const requiredText = (label: string, max = 160) =>
  z.string().trim().min(1, `${label} é obrigatório.`).max(max)

const optionalText = (max = 500) => z.string().trim().max(max).optional()
const entityId = z.string().trim().min(1)
const nonNegativeNumber = z.coerce.number().finite().nonnegative()
const positiveNumber = z.coerce.number().finite().positive()

export const supplierOrganizationSchema = z.object({
  name: requiredText('Nome'),
  legalName: optionalText(200),
  documentNumber: requiredText('CNPJ', 32),
  contactName: requiredText('Responsável'),
  contactEmail: z.string().trim().email('E-mail inválido.'),
  contactPhone: requiredText('Telefone', 32),
  responsibilityVersion: requiredText('Versão do termo', 40),
  responsibilityAccepted: z.literal(true, {
    errorMap: () => ({ message: 'O fornecedor deve aceitar o termo de responsabilidade.' }),
  }),
})

export const commercialPartnerSchema = z.object({
  supplierOrganizationId: entityId,
  name: requiredText('Nome'),
  documentNumber: optionalText(32),
  email: z.string().trim().email('E-mail inválido.').optional(),
  phone: optionalText(32),
})

export const generatorPlantSchema = z.object({
  supplierOrganizationId: entityId,
  sharedGenerationEntityId: entityId,
  distributionUtilityId: entityId,
  name: requiredText('Nome da usina'),
  internalCode: requiredText('Código interno', 80),
  generationUnitNumber: optionalText(80),
  city: requiredText('Cidade', 120),
  state: z.string().trim().length(2, 'Informe a UF com duas letras.').transform((value) => value.toUpperCase()),
  source: z.enum(['SOLAR', 'WIND', 'HYDRO', 'BIOMASS', 'BIOGAS', 'COGENERATION', 'OTHER']),
  installedPowerKw: positiveNumber,
  averageMonthlyGenerationKwh: positiveNumber.optional(),
})

export const capacityPeriodSchema = z.object({
  plantId: entityId,
  referenceMonth: z.coerce.date(),
  operationalKwh: nonNegativeNumber,
  contractedKwh: nonNegativeNumber.default(0),
  reservedKwh: nonNegativeNumber.default(0),
  safetyMarginKwh: nonNegativeNumber.default(0),
})

export const prospectSchema = z.object({
  supplierOrganizationId: entityId,
  currentCommercialPartnerId: entityId,
  name: requiredText('Nome'),
  documentNumber: optionalText(32),
  email: z.string().trim().email('E-mail inválido.').optional(),
  phone: optionalText(32),
  source: optionalText(80),
  notes: optionalText(2000),
  consentVersion: requiredText('Versão do consentimento', 40),
  consentAccepted: z.literal(true, {
    errorMap: () => ({ message: 'O titular deve consentir com o tratamento dos dados.' }),
  }),
})

export const consumerUnitSchema = z.object({
  prospectId: entityId,
  distributionUtilityId: entityId,
  unitNumber: requiredText('Número da unidade consumidora', 80),
  city: requiredText('Cidade', 120),
  state: z.string().trim().length(2, 'Informe a UF com duas letras.').transform((value) => value.toUpperCase()),
  customerClass: optionalText(80),
  tariffGroup: optionalText(40),
  connectionType: optionalText(80),
  averageMonthlyConsumptionKwh: positiveNumber,
  averageBillAmount: positiveNumber.optional(),
})

export const proposalSchema = z.object({
  matchId: entityId,
  consumerUnitId: entityId,
  quotaKwh: positiveNumber,
  monthlyLeaseAmount: positiveNumber,
  estimatedMonthlySavings: nonNegativeNumber.optional(),
  estimatedSavingsPercent: z.coerce.number().finite().min(0).max(100).optional(),
  validUntil: z.coerce.date(),
  terms: z.record(z.unknown()).optional(),
})

export type SupplierOrganizationInput = z.infer<typeof supplierOrganizationSchema>
export type CommercialPartnerInput = z.infer<typeof commercialPartnerSchema>
export type GeneratorPlantInput = z.infer<typeof generatorPlantSchema>
export type CapacityPeriodInput = z.infer<typeof capacityPeriodSchema>
export type ProspectInput = z.infer<typeof prospectSchema>
export type ConsumerUnitInput = z.infer<typeof consumerUnitSchema>
export type ProposalInput = z.infer<typeof proposalSchema>
