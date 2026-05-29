// Currency helpers: operate in paise (integer) to avoid floating point issues
export const rupeesToPaise = (value) => {
  // Accept number or string. If value looks like paise already (integer and >= 1000), assume paise.
  if (value === null || value === undefined) return 0
  const num = Number(value)
  if (Number.isNaN(num)) return 0
  // If it's an integer and likely already paise (>= 1000), assume paise
  if (Number.isInteger(num) && Math.abs(num) >= 1000) return num
  // Otherwise treat as rupees and convert to paise safely
  return Math.round(num * 100)
}

export const paiseToRupeesNumber = (paise) => {
  const p = Number(paise) || 0
  return p / 100
}

export const formatINRFromPaise = (paise) => {
  const rupees = paiseToRupeesNumber(paise)
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(rupees)
}

export default { rupeesToPaise, paiseToRupeesNumber, formatINRFromPaise }
