import { calculateSuggestedQuota } from '@/lib/domain/capacity'

export type MatchReasonCode =
  | 'DIFFERENT_DISTRIBUTION_UTILITY'
  | 'PLANT_NOT_OPERATIONAL'
  | 'PLANT_NOT_QUALIFIED'
  | 'NO_AVAILABLE_CAPACITY'
  | 'MISSING_CONSUMPTION_HISTORY'

export type MatchEvaluationInput = {
  consumerUtilityId: string
  plantUtilityId: string
  averageMonthlyConsumptionKwh: number
  availableKwh: number
  coverageRatio?: number
  plantOperational: boolean
  plantQualified: boolean
}

export type MatchEvaluation = {
  eligible: boolean
  suggestedKwh: number
  score: number
  reasonCodes: MatchReasonCode[]
}

export function evaluateMatch(input: MatchEvaluationInput): MatchEvaluation {
  const reasonCodes: MatchReasonCode[] = []
  const sameUtility = input.consumerUtilityId === input.plantUtilityId

  if (!sameUtility) reasonCodes.push('DIFFERENT_DISTRIBUTION_UTILITY')
  if (!input.plantOperational) reasonCodes.push('PLANT_NOT_OPERATIONAL')
  if (!input.plantQualified) reasonCodes.push('PLANT_NOT_QUALIFIED')
  if (input.availableKwh <= 0) reasonCodes.push('NO_AVAILABLE_CAPACITY')
  if (input.averageMonthlyConsumptionKwh <= 0) {
    reasonCodes.push('MISSING_CONSUMPTION_HISTORY')
  }

  const eligible = reasonCodes.length === 0
  const suggestedKwh = eligible
    ? calculateSuggestedQuota(
        input.averageMonthlyConsumptionKwh,
        input.availableKwh,
        input.coverageRatio,
      )
    : 0

  const score = Math.min(
    100,
    (sameUtility ? 45 : 0) +
      (input.availableKwh > 0 ? 25 : 0) +
      (input.plantOperational ? 15 : 0) +
      (input.plantQualified ? 15 : 0),
  )

  return { eligible, suggestedKwh, score, reasonCodes }
}
