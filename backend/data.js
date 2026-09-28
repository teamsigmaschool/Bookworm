function noonFromToday(days) {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + days)
  return date
}

function timeFromToday(days, hours) {
  const date = new Date()
  date.setHours(hours, 0, 0, 0)
  date.setDate(date.getDate() + days)
  return date
}

const books = [
  { id: 1, title: 'The Secret Garden', author: 'Frances Hodgson Burnett' },
  { id: 2, title: 'A Wrinkle in Time', author: "Madeleine L'Engle" },
  { id: 3, title: 'The Hobbit', author: 'J. R. R. Tolkien' },
  { id: 4, title: 'Coraline', author: 'Neil Gaiman' },
  { id: 5, title: 'The Little Prince', author: 'Antoine de Saint-Exupéry' },
  { id: 6, title: 'Anne of Green Gables', author: 'L. M. Montgomery' },
  { id: 7, title: 'Matilda', author: 'Roald Dahl' },
  { id: 8, title: 'The Giver', author: 'Lois Lowry' },
  { id: 9, title: 'Wonder', author: 'R. J. Palacio' },
  { id: 10, title: 'Holes', author: 'Louis Sachar' },
  { id: 11, title: 'The Phantom Tollbooth', author: 'Norton Juster' },
  { id: 12, title: 'The Wild Robot', author: 'Peter Brown' },
]

const loans = [
  { id: 1, bookId: 1, member: 'Aina', borrowedAt: noonFromToday(-17), dueDate: noonFromToday(-3), returnedAt: null, renewals: 0 },
  { id: 2, bookId: 2, member: 'Hafiz', borrowedAt: noonFromToday(-15).toISOString(), dueDate: noonFromToday(-1).toISOString(), returnedAt: null, renewals: 0 },
  { id: 3, bookId: 3, member: 'Mei', borrowedAt: noonFromToday(-11), dueDate: noonFromToday(3), returnedAt: null, renewals: 0 },
  { id: 4, bookId: 4, member: 'Kumar', borrowedAt: noonFromToday(-6), dueDate: noonFromToday(8), returnedAt: null, renewals: 0 },
  { id: 5, bookId: 5, member: 'Sara', borrowedAt: noonFromToday(-4), dueDate: noonFromToday(10), returnedAt: null, renewals: 0 },
  { id: 6, bookId: 6, member: 'Nadia', borrowedAt: timeFromToday(-14, 9).toISOString(), dueDate: timeFromToday(0, 9).toISOString(), returnedAt: null, renewals: 0 },
  { id: 7, bookId: 12, member: 'Danish', borrowedAt: timeFromToday(-14, 21).toISOString(), dueDate: timeFromToday(0, 21).toISOString(), returnedAt: null, renewals: 0 },
]

module.exports = { books, loans }
