const DAY = 24 * 60 * 60 * 1000

function addDays(date, days) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function daysLate(dueDate, now = new Date()) {
  const due = new Date(dueDate)
  return Math.max(0, Math.ceil((now - due) / DAY))
}

function lateFee(dueDate, now = new Date()) {
  return Math.min(10, daysLate(dueDate, now) * 0.5)
}

module.exports = { addDays, daysLate, lateFee }
