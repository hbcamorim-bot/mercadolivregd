export type CapacityBreakdown = {
  operationalKwh: number
  contractedKwh: number
  reservedKwh: number
  safetyMarginKwh: number
}

const KWH_PRECISION = 3

function assertNonNegative(value: number, field: string) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${field} deve ser um número finito maior ou igual a zero.`)
  }
}

function roundKwh(value: number) {
  return Number(value.toFixed(KWH_PRECISION))
}

export function calculateAvailableCapacity(capacity: CapacityBreakdown) {
  Object.entries(capacity).forEach(([field, value]) => assertNonNegative(value, field))

  return roundKwh(
    Math.max(
      0,
      capacity.operationalKwh -
        capacity.contractedKwh -
        capacity.reservedKwh -
        capacity.safetyMarginKwh,
    ),
  )
}

export function calculateSuggestedQuota(
  averageMonthlyConsumptionKwh: number,
  availableKwh: number,
  coverageRatio = 0.85,
) {
  assertNonNegative(averageMonthlyConsumptionKwh, 'averageMonthlyConsumptionKwh')
  assertNonNegative(availableKwh, 'availableKwh')

  if (!Number.isFinite(coverageRatio) || coverageRatio <= 0 || coverageRatio > 1) {
    throw new RangeError('coverageRatio deve ser maior que zero e menor ou igual a um.')
  }

  return roundKwh(Math.min(averageMonthlyConsumptionKwh * coverageRatio, availableKwh))
}

export function calculateCapacityUtilization(capacity: CapacityBreakdown) {
  Object.entries(capacity).forEach(([field, value]) => assertNonNegative(value, field))

  if (capacity.operationalKwh === 0) return 0

  const committedKwh = capacity.contractedKwh + capacity.reservedKwh
  return Number(Math.min(100, (committedKwh / capacity.operationalKwh) * 100).toFixed(2))
}

export function canReserveCapacity(availableKwh: number, requestedKwh: number) {
  assertNonNegative(availableKwh, 'availableKwh')
  assertNonNegative(requestedKwh, 'requestedKwh')

  return requestedKwh > 0 && requestedKwh <= availableKwh
}
