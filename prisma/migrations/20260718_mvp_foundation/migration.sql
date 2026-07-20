-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('PLATFORM', 'SUPPLIER', 'PARTNER', 'ASSOCIATION', 'COOPERATIVE', 'CONSORTIUM', 'OTHER');

-- CreateEnum
CREATE TYPE "OrganizationStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'SUSPENDED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('PLATFORM_ADMIN', 'SUPPLIER_ADMIN', 'SUPPLIER_OPERATOR', 'COMMERCIAL_PARTNER', 'VIEWER');

-- CreateEnum
CREATE TYPE "SharedGenerationEntityType" AS ENUM ('ASSOCIATION', 'COOPERATIVE', 'CONSORTIUM', 'OTHER');

-- CreateEnum
CREATE TYPE "QualificationStatus" AS ENUM ('DRAFT', 'DOCUMENTS_PENDING', 'UNDER_REVIEW', 'APPROVED_FOR_PUBLICATION', 'SUSPENDED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PlantStatus" AS ENUM ('DRAFT', 'UNDER_REVIEW', 'OPERATIONAL', 'SUSPENDED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "EnergySource" AS ENUM ('SOLAR', 'WIND', 'HYDRO', 'BIOMASS', 'BIOGAS', 'COGENERATION', 'OTHER');

-- CreateEnum
CREATE TYPE "ProspectStatus" AS ENUM ('NEW', 'CONTACTED', 'DOCUMENTS_PENDING', 'QUALIFIED', 'MATCHED', 'PROPOSAL_SENT', 'NEGOTIATING', 'MEMBERSHIP_PENDING', 'CONTRACT_PENDING', 'ACTIVATION_PENDING', 'ACTIVE', 'LOST', 'INELIGIBLE');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('SUGGESTED', 'REVIEWED', 'RESERVED', 'DISCARDED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('ACTIVE', 'CONVERTED', 'RELEASED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'SENT', 'VIEWED', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EntityMembershipStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'ENDED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AgreementStatus" AS ENUM ('DRAFT', 'SIGNATURE_PENDING', 'SIGNED', 'ACTIVE', 'SUSPENDED', 'ENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "QuotaStatus" AS ENUM ('RESERVED', 'CONTRACTED', 'ACTIVE', 'SUSPENDED', 'RELEASED');

-- CreateEnum
CREATE TYPE "ActivationStatus" AS ENUM ('NOT_STARTED', 'DOCUMENTS_PENDING', 'READY_TO_SUBMIT', 'SUBMITTED', 'UNDER_UTILITY_REVIEW', 'CORRECTION_REQUESTED', 'APPROVED', 'ACTIVATED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AllocationStatus" AS ENUM ('PLANNED', 'SUBMITTED', 'CONFIRMED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CommissionType" AS ENUM ('FIXED_ON_ACTIVATION', 'PERCENTAGE_OF_LEASE', 'RECURRING_PER_ACTIVE_UNIT');

-- CreateEnum
CREATE TYPE "CommissionStatus" AS ENUM ('PENDING', 'ELIGIBLE', 'APPROVED', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ConsentType" AS ENUM ('PRIVACY', 'DATA_PROCESSING', 'COMMERCIAL_CONTACT', 'DOCUMENT_SHARING');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "legalName" TEXT,
    "documentNumber" TEXT,
    "type" "OrganizationType" NOT NULL,
    "status" "OrganizationStatus" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMembership" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "role" "MembershipRole" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierProfile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "contactName" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "website" TEXT,
    "onboardingNotes" TEXT,
    "responsibilityAcceptedAt" TIMESTAMP(3),
    "responsibilityVersion" TEXT,

    CONSTRAINT "SupplierProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommercialPartner" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "supplierOrganizationId" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "documentNumber" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "status" "OrganizationStatus" NOT NULL DEFAULT 'PENDING_REVIEW',

    CONSTRAINT "CommercialPartner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DistributionUtility" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DistributionUtility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedGenerationEntity" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "supplierOrganizationId" TEXT NOT NULL,
    "type" "SharedGenerationEntityType" NOT NULL,
    "name" TEXT NOT NULL,
    "legalName" TEXT,
    "documentNumber" TEXT,
    "qualificationStatus" "QualificationStatus" NOT NULL DEFAULT 'DRAFT',
    "termsVersion" TEXT,
    "termsStorageKey" TEXT,

    CONSTRAINT "SharedGenerationEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratorPlant" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "supplierOrganizationId" TEXT NOT NULL,
    "sharedGenerationEntityId" TEXT NOT NULL,
    "distributionUtilityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "internalCode" TEXT NOT NULL,
    "holderDocumentNumber" TEXT,
    "generationUnitNumber" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "source" "EnergySource" NOT NULL,
    "installedPowerKw" DECIMAL(14,3) NOT NULL,
    "averageMonthlyGenerationKwh" DECIMAL(16,3),
    "connectedAt" TIMESTAMP(3),
    "status" "PlantStatus" NOT NULL DEFAULT 'DRAFT',
    "qualificationStatus" "QualificationStatus" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "GeneratorPlant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantDocument" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "plantId" TEXT,
    "sharedGenerationEntityId" TEXT,
    "type" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "sha256" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "PlantDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapacityPeriod" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "plantId" TEXT NOT NULL,
    "referenceMonth" TIMESTAMP(3) NOT NULL,
    "operationalKwh" DECIMAL(16,3) NOT NULL,
    "contractedKwh" DECIMAL(16,3) NOT NULL DEFAULT 0,
    "reservedKwh" DECIMAL(16,3) NOT NULL DEFAULT 0,
    "safetyMarginKwh" DECIMAL(16,3) NOT NULL DEFAULT 0,
    "availableKwh" DECIMAL(16,3) NOT NULL,

    CONSTRAINT "CapacityPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prospect" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "supplierOrganizationId" TEXT NOT NULL,
    "currentCommercialPartnerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "documentNumber" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "source" TEXT,
    "status" "ProspectStatus" NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "consentAt" TIMESTAMP(3),
    "consentVersion" TEXT,

    CONSTRAINT "Prospect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadOwnership" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prospectId" TEXT NOT NULL,
    "commercialPartnerId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3),
    "reason" TEXT,

    CONSTRAINT "LeadOwnership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsumerUnit" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "prospectId" TEXT NOT NULL,
    "distributionUtilityId" TEXT NOT NULL,
    "unitNumber" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "customerClass" TEXT,
    "tariffGroup" TEXT,
    "connectionType" TEXT,
    "averageMonthlyConsumptionKwh" DECIMAL(16,3),
    "averageBillAmount" DECIMAL(14,2),

    CONSTRAINT "ConsumerUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsumptionReading" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consumerUnitId" TEXT NOT NULL,
    "referenceMonth" TIMESTAMP(3) NOT NULL,
    "consumptionKwh" DECIMAL(16,3) NOT NULL,
    "billAmount" DECIMAL(14,2),
    "source" TEXT,

    CONSTRAINT "ConsumptionReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProspectDocument" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "prospectId" TEXT NOT NULL,
    "consumerUnitId" TEXT,
    "type" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "sha256" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "ProspectDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "consumerUnitId" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "capacityPeriodId" TEXT,
    "suggestedKwh" DECIMAL(16,3) NOT NULL,
    "estimatedMonthlySavings" DECIMAL(14,2),
    "estimatedSavingsPercent" DECIMAL(5,2),
    "score" DECIMAL(5,2) NOT NULL,
    "rationale" JSONB,
    "status" "MatchStatus" NOT NULL DEFAULT 'SUGGESTED',
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapacityReservation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "matchId" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "consumerUnitId" TEXT NOT NULL,
    "capacityPeriodId" TEXT,
    "reservedKwh" DECIMAL(16,3) NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "releasedAt" TIMESTAMP(3),

    CONSTRAINT "CapacityReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "matchId" TEXT NOT NULL,
    "consumerUnitId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'DRAFT',
    "quotaKwh" DECIMAL(16,3) NOT NULL,
    "monthlyLeaseAmount" DECIMAL(14,2) NOT NULL,
    "estimatedMonthlySavings" DECIMAL(14,2),
    "estimatedSavingsPercent" DECIMAL(5,2),
    "validUntil" TIMESTAMP(3) NOT NULL,
    "terms" JSONB,
    "sentAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssociationMembership" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sharedGenerationEntityId" TEXT NOT NULL,
    "prospectId" TEXT NOT NULL,
    "consumerUnitId" TEXT NOT NULL,
    "status" "EntityMembershipStatus" NOT NULL DEFAULT 'PENDING',
    "membershipNumber" TEXT,
    "joinedAt" TIMESTAMP(3),
    "leftAt" TIMESTAMP(3),

    CONSTRAINT "AssociationMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotaLeaseAgreement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "proposalId" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "consumerUnitId" TEXT NOT NULL,
    "sharedGenerationEntityId" TEXT NOT NULL,
    "associationMembershipId" TEXT,
    "status" "AgreementStatus" NOT NULL DEFAULT 'DRAFT',
    "quotaKwh" DECIMAL(16,3) NOT NULL,
    "monthlyLeaseAmount" DECIMAL(14,2) NOT NULL,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "signedAt" TIMESTAMP(3),
    "externalSignatureId" TEXT,
    "signedDocumentStorageKey" TEXT,

    CONSTRAINT "QuotaLeaseAgreement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantQuota" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "agreementId" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "consumerUnitId" TEXT NOT NULL,
    "status" "QuotaStatus" NOT NULL DEFAULT 'RESERVED',
    "quotaKwh" DECIMAL(16,3) NOT NULL,
    "reservedAt" TIMESTAMP(3),
    "contractedAt" TIMESTAMP(3),
    "activeAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "PlantQuota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivationProcess" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "agreementId" TEXT NOT NULL,
    "consumerUnitId" TEXT NOT NULL,
    "distributionUtilityId" TEXT NOT NULL,
    "status" "ActivationStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "protocolNumber" TEXT,
    "expectedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "activatedAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "ActivationProcess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Allocation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "agreementId" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "consumerUnitId" TEXT NOT NULL,
    "referenceMonth" TIMESTAMP(3) NOT NULL,
    "allocatedKwh" DECIMAL(16,3) NOT NULL,
    "percentage" DECIMAL(7,4),
    "priority" INTEGER,
    "status" "AllocationStatus" NOT NULL DEFAULT 'PLANNED',

    CONSTRAINT "Allocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommissionPolicy" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "supplierOrganizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CommissionType" NOT NULL,
    "fixedAmount" DECIMAL(14,2),
    "percentage" DECIMAL(7,4),
    "recurringMonths" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CommissionPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommissionEntry" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "commercialPartnerId" TEXT NOT NULL,
    "prospectId" TEXT NOT NULL,
    "agreementId" TEXT NOT NULL,
    "policyId" TEXT,
    "status" "CommissionStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(14,2) NOT NULL,
    "competence" TIMESTAMP(3) NOT NULL,
    "eligibleAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "paymentReference" TEXT,

    CONSTRAINT "CommissionEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentRecord" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prospectId" TEXT NOT NULL,
    "consumerUnitId" TEXT,
    "type" "ConsentType" NOT NULL,
    "version" TEXT NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "source" TEXT,

    CONSTRAINT "ConsentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organizationId" TEXT,
    "actorUserId" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_documentNumber_key" ON "Organization"("documentNumber");

-- CreateIndex
CREATE INDEX "Organization_type_status_idx" ON "Organization"("type", "status");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "UserMembership_organizationId_role_active_idx" ON "UserMembership"("organizationId", "role", "active");

-- CreateIndex
CREATE UNIQUE INDEX "UserMembership_userId_organizationId_key" ON "UserMembership"("userId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierProfile_organizationId_key" ON "SupplierProfile"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "CommercialPartner_userId_key" ON "CommercialPartner"("userId");

-- CreateIndex
CREATE INDEX "CommercialPartner_supplierOrganizationId_status_idx" ON "CommercialPartner"("supplierOrganizationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "DistributionUtility_code_key" ON "DistributionUtility"("code");

-- CreateIndex
CREATE INDEX "SharedGenerationEntity_supplierOrganizationId_qualification_idx" ON "SharedGenerationEntity"("supplierOrganizationId", "qualificationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "SharedGenerationEntity_supplierOrganizationId_name_key" ON "SharedGenerationEntity"("supplierOrganizationId", "name");

-- CreateIndex
CREATE INDEX "GeneratorPlant_distributionUtilityId_status_qualificationSt_idx" ON "GeneratorPlant"("distributionUtilityId", "status", "qualificationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "GeneratorPlant_supplierOrganizationId_internalCode_key" ON "GeneratorPlant"("supplierOrganizationId", "internalCode");

-- CreateIndex
CREATE INDEX "PlantDocument_plantId_type_status_idx" ON "PlantDocument"("plantId", "type", "status");

-- CreateIndex
CREATE INDEX "PlantDocument_sharedGenerationEntityId_type_status_idx" ON "PlantDocument"("sharedGenerationEntityId", "type", "status");

-- CreateIndex
CREATE INDEX "CapacityPeriod_referenceMonth_availableKwh_idx" ON "CapacityPeriod"("referenceMonth", "availableKwh");

-- CreateIndex
CREATE UNIQUE INDEX "CapacityPeriod_plantId_referenceMonth_key" ON "CapacityPeriod"("plantId", "referenceMonth");

-- CreateIndex
CREATE INDEX "Prospect_supplierOrganizationId_status_idx" ON "Prospect"("supplierOrganizationId", "status");

-- CreateIndex
CREATE INDEX "Prospect_currentCommercialPartnerId_status_idx" ON "Prospect"("currentCommercialPartnerId", "status");

-- CreateIndex
CREATE INDEX "LeadOwnership_prospectId_startsAt_idx" ON "LeadOwnership"("prospectId", "startsAt");

-- CreateIndex
CREATE INDEX "LeadOwnership_commercialPartnerId_endsAt_idx" ON "LeadOwnership"("commercialPartnerId", "endsAt");

-- CreateIndex
CREATE INDEX "ConsumerUnit_prospectId_idx" ON "ConsumerUnit"("prospectId");

-- CreateIndex
CREATE UNIQUE INDEX "ConsumerUnit_distributionUtilityId_unitNumber_key" ON "ConsumerUnit"("distributionUtilityId", "unitNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ConsumptionReading_consumerUnitId_referenceMonth_key" ON "ConsumptionReading"("consumerUnitId", "referenceMonth");

-- CreateIndex
CREATE INDEX "ProspectDocument_prospectId_type_status_idx" ON "ProspectDocument"("prospectId", "type", "status");

-- CreateIndex
CREATE INDEX "ProspectDocument_consumerUnitId_type_status_idx" ON "ProspectDocument"("consumerUnitId", "type", "status");

-- CreateIndex
CREATE INDEX "Match_consumerUnitId_status_idx" ON "Match"("consumerUnitId", "status");

-- CreateIndex
CREATE INDEX "Match_plantId_status_idx" ON "Match"("plantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "CapacityReservation_matchId_key" ON "CapacityReservation"("matchId");

-- CreateIndex
CREATE INDEX "CapacityReservation_plantId_status_expiresAt_idx" ON "CapacityReservation"("plantId", "status", "expiresAt");

-- CreateIndex
CREATE INDEX "CapacityReservation_consumerUnitId_status_idx" ON "CapacityReservation"("consumerUnitId", "status");

-- CreateIndex
CREATE INDEX "Proposal_consumerUnitId_status_idx" ON "Proposal"("consumerUnitId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Proposal_matchId_version_key" ON "Proposal"("matchId", "version");

-- CreateIndex
CREATE INDEX "AssociationMembership_prospectId_status_idx" ON "AssociationMembership"("prospectId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "AssociationMembership_sharedGenerationEntityId_consumerUnit_key" ON "AssociationMembership"("sharedGenerationEntityId", "consumerUnitId");

-- CreateIndex
CREATE UNIQUE INDEX "QuotaLeaseAgreement_proposalId_key" ON "QuotaLeaseAgreement"("proposalId");

-- CreateIndex
CREATE INDEX "QuotaLeaseAgreement_plantId_status_idx" ON "QuotaLeaseAgreement"("plantId", "status");

-- CreateIndex
CREATE INDEX "QuotaLeaseAgreement_consumerUnitId_status_idx" ON "QuotaLeaseAgreement"("consumerUnitId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "PlantQuota_agreementId_key" ON "PlantQuota"("agreementId");

-- CreateIndex
CREATE INDEX "PlantQuota_plantId_status_idx" ON "PlantQuota"("plantId", "status");

-- CreateIndex
CREATE INDEX "PlantQuota_consumerUnitId_status_idx" ON "PlantQuota"("consumerUnitId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ActivationProcess_agreementId_key" ON "ActivationProcess"("agreementId");

-- CreateIndex
CREATE INDEX "ActivationProcess_distributionUtilityId_status_idx" ON "ActivationProcess"("distributionUtilityId", "status");

-- CreateIndex
CREATE INDEX "ActivationProcess_consumerUnitId_status_idx" ON "ActivationProcess"("consumerUnitId", "status");

-- CreateIndex
CREATE INDEX "Allocation_plantId_referenceMonth_status_idx" ON "Allocation"("plantId", "referenceMonth", "status");

-- CreateIndex
CREATE INDEX "Allocation_consumerUnitId_referenceMonth_idx" ON "Allocation"("consumerUnitId", "referenceMonth");

-- CreateIndex
CREATE UNIQUE INDEX "Allocation_agreementId_referenceMonth_key" ON "Allocation"("agreementId", "referenceMonth");

-- CreateIndex
CREATE INDEX "CommissionPolicy_supplierOrganizationId_active_idx" ON "CommissionPolicy"("supplierOrganizationId", "active");

-- CreateIndex
CREATE INDEX "CommissionEntry_status_competence_idx" ON "CommissionEntry"("status", "competence");

-- CreateIndex
CREATE UNIQUE INDEX "CommissionEntry_commercialPartnerId_agreementId_competence_key" ON "CommissionEntry"("commercialPartnerId", "agreementId", "competence");

-- CreateIndex
CREATE INDEX "ConsentRecord_prospectId_type_grantedAt_idx" ON "ConsentRecord"("prospectId", "type", "grantedAt");

-- CreateIndex
CREATE INDEX "AuditEvent_organizationId_createdAt_idx" ON "AuditEvent"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditEvent_entityType_entityId_createdAt_idx" ON "AuditEvent"("entityType", "entityId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditEvent_actorUserId_createdAt_idx" ON "AuditEvent"("actorUserId", "createdAt");

-- AddForeignKey
ALTER TABLE "UserMembership" ADD CONSTRAINT "UserMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMembership" ADD CONSTRAINT "UserMembership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierProfile" ADD CONSTRAINT "SupplierProfile_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommercialPartner" ADD CONSTRAINT "CommercialPartner_supplierOrganizationId_fkey" FOREIGN KEY ("supplierOrganizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommercialPartner" ADD CONSTRAINT "CommercialPartner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedGenerationEntity" ADD CONSTRAINT "SharedGenerationEntity_supplierOrganizationId_fkey" FOREIGN KEY ("supplierOrganizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratorPlant" ADD CONSTRAINT "GeneratorPlant_supplierOrganizationId_fkey" FOREIGN KEY ("supplierOrganizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratorPlant" ADD CONSTRAINT "GeneratorPlant_sharedGenerationEntityId_fkey" FOREIGN KEY ("sharedGenerationEntityId") REFERENCES "SharedGenerationEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratorPlant" ADD CONSTRAINT "GeneratorPlant_distributionUtilityId_fkey" FOREIGN KEY ("distributionUtilityId") REFERENCES "DistributionUtility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantDocument" ADD CONSTRAINT "PlantDocument_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "GeneratorPlant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantDocument" ADD CONSTRAINT "PlantDocument_sharedGenerationEntityId_fkey" FOREIGN KEY ("sharedGenerationEntityId") REFERENCES "SharedGenerationEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapacityPeriod" ADD CONSTRAINT "CapacityPeriod_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "GeneratorPlant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prospect" ADD CONSTRAINT "Prospect_supplierOrganizationId_fkey" FOREIGN KEY ("supplierOrganizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prospect" ADD CONSTRAINT "Prospect_currentCommercialPartnerId_fkey" FOREIGN KEY ("currentCommercialPartnerId") REFERENCES "CommercialPartner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadOwnership" ADD CONSTRAINT "LeadOwnership_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadOwnership" ADD CONSTRAINT "LeadOwnership_commercialPartnerId_fkey" FOREIGN KEY ("commercialPartnerId") REFERENCES "CommercialPartner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumerUnit" ADD CONSTRAINT "ConsumerUnit_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumerUnit" ADD CONSTRAINT "ConsumerUnit_distributionUtilityId_fkey" FOREIGN KEY ("distributionUtilityId") REFERENCES "DistributionUtility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumptionReading" ADD CONSTRAINT "ConsumptionReading_consumerUnitId_fkey" FOREIGN KEY ("consumerUnitId") REFERENCES "ConsumerUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProspectDocument" ADD CONSTRAINT "ProspectDocument_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProspectDocument" ADD CONSTRAINT "ProspectDocument_consumerUnitId_fkey" FOREIGN KEY ("consumerUnitId") REFERENCES "ConsumerUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_consumerUnitId_fkey" FOREIGN KEY ("consumerUnitId") REFERENCES "ConsumerUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "GeneratorPlant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_capacityPeriodId_fkey" FOREIGN KEY ("capacityPeriodId") REFERENCES "CapacityPeriod"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapacityReservation" ADD CONSTRAINT "CapacityReservation_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapacityReservation" ADD CONSTRAINT "CapacityReservation_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "GeneratorPlant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapacityReservation" ADD CONSTRAINT "CapacityReservation_consumerUnitId_fkey" FOREIGN KEY ("consumerUnitId") REFERENCES "ConsumerUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapacityReservation" ADD CONSTRAINT "CapacityReservation_capacityPeriodId_fkey" FOREIGN KEY ("capacityPeriodId") REFERENCES "CapacityPeriod"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_consumerUnitId_fkey" FOREIGN KEY ("consumerUnitId") REFERENCES "ConsumerUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssociationMembership" ADD CONSTRAINT "AssociationMembership_sharedGenerationEntityId_fkey" FOREIGN KEY ("sharedGenerationEntityId") REFERENCES "SharedGenerationEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssociationMembership" ADD CONSTRAINT "AssociationMembership_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssociationMembership" ADD CONSTRAINT "AssociationMembership_consumerUnitId_fkey" FOREIGN KEY ("consumerUnitId") REFERENCES "ConsumerUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotaLeaseAgreement" ADD CONSTRAINT "QuotaLeaseAgreement_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotaLeaseAgreement" ADD CONSTRAINT "QuotaLeaseAgreement_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "GeneratorPlant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotaLeaseAgreement" ADD CONSTRAINT "QuotaLeaseAgreement_consumerUnitId_fkey" FOREIGN KEY ("consumerUnitId") REFERENCES "ConsumerUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotaLeaseAgreement" ADD CONSTRAINT "QuotaLeaseAgreement_sharedGenerationEntityId_fkey" FOREIGN KEY ("sharedGenerationEntityId") REFERENCES "SharedGenerationEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotaLeaseAgreement" ADD CONSTRAINT "QuotaLeaseAgreement_associationMembershipId_fkey" FOREIGN KEY ("associationMembershipId") REFERENCES "AssociationMembership"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantQuota" ADD CONSTRAINT "PlantQuota_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "QuotaLeaseAgreement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantQuota" ADD CONSTRAINT "PlantQuota_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "GeneratorPlant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantQuota" ADD CONSTRAINT "PlantQuota_consumerUnitId_fkey" FOREIGN KEY ("consumerUnitId") REFERENCES "ConsumerUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivationProcess" ADD CONSTRAINT "ActivationProcess_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "QuotaLeaseAgreement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivationProcess" ADD CONSTRAINT "ActivationProcess_consumerUnitId_fkey" FOREIGN KEY ("consumerUnitId") REFERENCES "ConsumerUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivationProcess" ADD CONSTRAINT "ActivationProcess_distributionUtilityId_fkey" FOREIGN KEY ("distributionUtilityId") REFERENCES "DistributionUtility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allocation" ADD CONSTRAINT "Allocation_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "QuotaLeaseAgreement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allocation" ADD CONSTRAINT "Allocation_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "GeneratorPlant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allocation" ADD CONSTRAINT "Allocation_consumerUnitId_fkey" FOREIGN KEY ("consumerUnitId") REFERENCES "ConsumerUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommissionPolicy" ADD CONSTRAINT "CommissionPolicy_supplierOrganizationId_fkey" FOREIGN KEY ("supplierOrganizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommissionEntry" ADD CONSTRAINT "CommissionEntry_commercialPartnerId_fkey" FOREIGN KEY ("commercialPartnerId") REFERENCES "CommercialPartner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommissionEntry" ADD CONSTRAINT "CommissionEntry_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommissionEntry" ADD CONSTRAINT "CommissionEntry_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "QuotaLeaseAgreement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommissionEntry" ADD CONSTRAINT "CommissionEntry_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "CommissionPolicy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentRecord" ADD CONSTRAINT "ConsentRecord_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentRecord" ADD CONSTRAINT "ConsentRecord_consumerUnitId_fkey" FOREIGN KEY ("consumerUnitId") REFERENCES "ConsumerUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
