export type CommissionCalculationInput =
  | {
      type: 'FIXED_ON_ACTIVATION' | 'RECURRING_PER_ACTIVE_UNIT'
      fixedAmount: number
    }
  | {
      type: 'PERCENTAGE_OF_LEASE'
      monthlyLeaseAmount: number
      percentage: number
    }

function assertMoney(value: number, field: string) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${field} deve ser um número finito maior ou igual a zero.`)
  }
}

function roundCurrency(value: number) {
  return Number(value.toFixed(2))
}

export function calculateCommission(input: CommissionCalculationInput) {
  if (input.type === 'PERCENTAGE_OF_LEASE') {
    assertMoney(input.monthlyLeaseAmount, 'monthlyLeaseAmount')

    if (!Number.isFinite(input.percentage) || input.percentage < 0 || input.percentage > 100) {
      throw new RangeError('percentage deve estar entre zero e cem.')
    }

    return roundCurrency(input.monthlyLeaseAmount * (input.percentage / 100))
  }

  assertMoney(input.fixedAmount, 'fixedAmount')
  return roundCurrency(input.fixedAmount)
}
