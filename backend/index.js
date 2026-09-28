const express = require('express')
const { books, loans } = require('./data')
const { addDays, daysLate, lateFee } = require('./rules')

const app = express()
app.use(express.json())

function activeLoan(bookId) {
  return loans.find((loan) => loan.bookId === bookId && !loan.returnedAt)
}

function bookWithLoan(book) {
  const loan = activeLoan(book.id)
  return { ...book, loan: loan || null }
}

app.get('/api/books', (req, res) => {
  res.json(books.map(bookWithLoan))
})

app.get('/api/loans/overdue', (req, res) => {
  const overdue = loans.filter((loan) => !loan.returnedAt && loan.dueDate < new Date())
  res.json(overdue.map((loan) => ({
    ...loan,
    book: books.find((book) => book.id === loan.bookId).title,
    daysLate: daysLate(loan.dueDate),
    fee: lateFee(loan.dueDate),
  })))
})

app.post('/api/loans', (req, res) => {
  const bookId = Number(req.body.bookId)
  const book = books.find((item) => item.id === bookId)
  if (!book) return res.status(404).json({ error: 'Book not found.' })
  if (activeLoan(bookId)) return res.status(409).json({ error: 'This book is already on loan.' })

  const source = req.body.source || 'desk'
  let member = req.body.member

  if (source === 'desk') {
    if (typeof member !== 'string') return res.status(400).json({ error: 'Enter a member name.' })
    member = member.trim()
    if (!member) return res.status(400).json({ error: 'Enter a member name.' })
    if (member.length > 40) return res.status(400).json({ error: 'Member name is too long.' })
  } else if (source === 'kiosk') {
    if (typeof member !== 'string') return res.status(400).json({ error: 'Enter a member name.' })
    if (!member.trim()) return res.status(400).json({ error: 'Enter a member name.' })
    if (member.length > 40) return res.status(400).json({ error: 'Member name is too long.' })
  } else if (source === 'staff') {
    if (typeof member !== 'string') return res.status(400).json({ error: 'Enter a member name.' })
    member = member.trim()
    if (!member) return res.status(400).json({ error: 'Enter a member name.' })
    if (member.length > 60) return res.status(400).json({ error: 'Member name is too long.' })
  } else {
    return res.status(400).json({ error: 'Unknown borrowing source.' })
  }

  const now = new Date()
  const loan = {
    id: loans.length + 1,
    bookId,
    member,
    borrowedAt: now.toISOString(),
    dueDate: addDays(now, 14).toISOString(),
    returnedAt: null,
    renewals: 0,
  }
  loans.push(loan)
  res.status(201).json(bookWithLoan(book))
})

app.post('/api/loans/:id/return', (req, res) => {
  const loan = loans.find((item) => item.id === Number(req.params.id) && !item.returnedAt)
  if (!loan) return res.status(404).json({ error: 'Active loan not found.' })
  loan.returnedAt = new Date().toISOString()
  res.json({ ok: true })
})

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error)
  console.error(error)
  res.status(500).json({ error: 'Something went wrong.' })
})

if (require.main === module) {
  app.listen(3001, () => console.log('Bookworm API at http://localhost:3001'))
}

module.exports = app
