// Client-side currency helpers. Internally we send/receive paise; UI shows rupees.
export const rupeesToPaise = (value) => {
  if (value === null || value === undefined) return 0
  const num = Number(value)
  if (Number.isNaN(num)) return 0
  if (Number.isInteger(num) && Math.abs(num) >= 1000) return num
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
