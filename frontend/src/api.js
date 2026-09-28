async function request(path, options) {
  const response = await fetch(path, options)
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Request failed.')
  return data
}

function withDate(book) {
  if (!book.loan) return book
  return { ...book, loan: { ...book.loan, dueDate: new Date(book.loan.dueDate) } }
}

export async function getBooks() {
  const books = await request('/api/books')
  return books.map(withDate)
}

export async function getOverdue() {
  return request('/api/loans/overdue')
}

export async function borrowBook(bookId, member) {
  const book = await request('/api/loans', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookId, member, source: 'desk' }),
  })
  return withDate(book)
}

export async function returnBook(loanId) {
  return request(`/api/loans/${loanId}/return`, { method: 'POST' })
}

export async function renewLoan(loanId, dueDate) {
  const book = await request(`/api/loans/${loanId}/renew`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dueDate }),
  })
  return withDate(book)
}
