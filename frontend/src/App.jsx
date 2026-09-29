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

  function selectBook(book) {
    setChosen(book.id)
    setMessage('')
    document.getElementById('member').focus()
  }

  const visible = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase()),
  )
  const chosenBook = books.find((book) => book.id === chosen)

  return (
    <>
      <header className="site-header">
        <div className="brand">
          <span className="brand-name">Bookworm</span>
          <span className="brand-rule" aria-hidden="true"></span>
          <span className="brand-description">School library</span>
        </div>
        <span className="header-label">CIRCULATION DESK</span>
      </header>
      <main>
        <div className="page-heading">
          <div>
            <h1>The catalogue</h1>
            <p>Find a book, check its loan, or send it home with a reader.</p>
          </div>
          <p className="collection-note">{books.length} books in the collection</p>
        </div>

        <div className="workbench">
          <section className="catalogue" aria-labelledby="catalogue-heading">
            <div className="catalogue-top">
              <h2 id="catalogue-heading">Browse the shelves</h2>
              <span>{visible.length} titles shown</span>
            </div>
            <label htmlFor="search">Search by title or author</label>
            <input id="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the catalogue" />
            {loading ? <p className="shelf-message">Loading the catalogue...</p> : null}
            {!loading && visible.length === 0 ? <p className="shelf-message">No books match that search. Try another title or author.</p> : null}
            <div className="shelf-list">
              {visible.map((book) => (
                <article className={chosen === book.id ? 'book-row selected' : 'book-row'} key={book.id}>
                  <span className="shelf-number">No. {book.id}</span>
                  <div className="book-identity">
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                  </div>
                  <LoanBadge loan={book.loan} />
                  {book.loan
                    ? <button className="row-button secondary" onClick={() => handleReturn(book)}>Return book</button>
                    : <button className="row-button" onClick={() => selectBook(book)}>Borrow book</button>}
                </article>
              ))}
            </div>
          </section>
          <aside className="desk">
            <section className="checkout-slip" aria-labelledby="checkout-heading">
              <div className="slip-top"><span>BOOKWORM</span><span>LOAN SLIP</span></div>
              <h2 id="checkout-heading">Borrow a book</h2>
              <p className="selected-title">{chosenBook ? chosenBook.title : 'Choose a book from the catalogue.'}</p>
              <p className="selected-author">{chosenBook ? chosenBook.author : 'Your selection will appear here.'}</p>
              <div className="slip-divider"></div>
              <form onSubmit={handleBorrow}>
                <label htmlFor="member">Member name</label>
                <input id="member" value={member} onChange={(event) => setMember(event.target.value)} maxLength="60" placeholder="Who is borrowing?" />
                <p className="loan-term">Loans are due 14 days after borrowing.</p>
                <button className="issue-button" disabled={chosen === null}>Confirm loan</button>
              </form>
              {message ? <p role="status" className="message">{message}</p> : null}
            </section>
            <section className="overdue" aria-labelledby="overdue-heading">
              <div className="overdue-heading">
                <h2 id="overdue-heading">Overdue loans</h2>
                <span>{overdue.length}</span>
              </div>
              {overdue.length === 0 ? <p className="no-overdue">All loans are on time.</p> : null}
              {overdue.map((loan) => (
                <div className="overdue-row" key={loan.id}>
                  <strong>{loan.book}</strong>
                  <span>{loan.member} · {loan.daysLate} days late</span>
                  <b>RM {loan.fee.toFixed(2)}</b>
                </div>
              ))}
            </section>
          </aside>
        </div>
      </main>
    </>
  )
}
