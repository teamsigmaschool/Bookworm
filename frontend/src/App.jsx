import { useEffect, useState } from 'react'
import { borrowBook, getBooks, getOverdue, returnBook } from './api.js'
import LoanBadge from './LoanBadge.jsx'

export default function App() {
  const [books, setBooks] = useState([])
  const [overdue, setOverdue] = useState([])
  const [search, setSearch] = useState('')
  const [member, setMember] = useState('')
  const [chosen, setChosen] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  async function refresh() {
    const [nextBooks, nextOverdue] = await Promise.all([getBooks(), getOverdue()])
    setBooks(nextBooks)
    setOverdue(nextOverdue)
    setLoading(false)
  }

  useEffect(() => {
    Promise.all([getBooks(), getOverdue()]).then(([nextBooks, nextOverdue]) => {
      setBooks(nextBooks)
      setOverdue(nextOverdue)
      setLoading(false)
    }).catch((error) => {
      setMessage(error.message)
      setLoading(false)
    })
  }, [])

  async function handleBorrow(event) {
    event.preventDefault()
    if (chosen === null) return
    try {
      const book = await borrowBook(chosen, member)
      setBooks((current) => current.map((item) => item.id === chosen ? book : item))
      setMember('')
      setChosen(null)
      setMessage(`Borrowed ${book.title}.`)
    } catch (error) {
      setMessage(error.message)
    }
  }

  async function handleReturn(book) {
    try {
      await returnBook(book.loan.id)
      setBooks((current) => current.map((item) => item.id === book.id ? { ...item, loan: null } : item))
      setMessage(`Returned ${book.title}.`)
      setTimeout(() => {
        refresh().catch((error) => setMessage(error.message))
      }, 700)
    } catch (error) {
      setMessage(error.message)
    }
  }

  const visible = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase()),
  )
  const chosenBook = books.find((book) => book.id === chosen)

  return (
    <>
      <header>
        <p className="wordmark">Bookworm<span>.</span></p>
        <p>School library lending desk</p>
      </header>
      <main>
        <section className="intro">
          <div>
            <p className="eyebrow">THE SHELF</p>
            <h1>Find a good book.</h1>
            <p>Search the shelf, borrow a title, or check what is overdue.</p>
          </div>
          <div className="counts">
            <strong>{books.length}</strong><span>books</span>
            <strong>{overdue.length}</strong><span>overdue</span>
          </div>
        </section>

        <div className="layout">
          <section>
            <label htmlFor="search">Search title or author</label>
            <input id="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Try The Hobbit" />
            {loading ? <p>Loading books...</p> : null}
            <div className="book-grid">
              {visible.map((book) => (
                <article className="book" key={book.id}>
                  <span className="book-mark">{book.title.charAt(0)}</span>
                  <h2>{book.title}</h2>
                  <p className="author">{book.author}</p>
                  <LoanBadge loan={book.loan} />
                  {book.loan
                    ? <button className="text-button" onClick={() => handleReturn(book)}>Return book</button>
                    : <button onClick={() => { setChosen(book.id); setMessage('') }}>Borrow book</button>}
                </article>
              ))}
            </div>
            {!loading && visible.length === 0 ? <p>No books match that search.</p> : null}
          </section>
          <aside>
            <div className="panel">
              <p className="eyebrow">LENDING DESK</p>
              <h2>Borrow a book</h2>
              {chosenBook ? <p>Selected: <strong>{chosenBook.title}</strong></p> : <p>Pick an available book from the shelf.</p>}
              <form onSubmit={handleBorrow}>
                <label htmlFor="member">Member name</label>
                <input id="member" value={member} onChange={(event) => setMember(event.target.value)} maxLength="60" />
                <button disabled={chosen === null}>Confirm loan</button>
              </form>
              {message ? <p role="status" className="message">{message}</p> : null}
            </div>
            <div className="overdue">
              <p className="eyebrow">NEEDS A NUDGE</p>
              <h2>Overdue loans</h2>
              {overdue.length === 0 ? <p>Nothing overdue.</p> : null}
              {overdue.map((loan) => (
                <div className="overdue-row" key={loan.id}>
                  <strong>{loan.book}</strong>
                  <span>{loan.member} · {loan.daysLate} days late</span>
                  <span>RM {loan.fee.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </>
  )
}
