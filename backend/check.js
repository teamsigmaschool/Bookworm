const cases = [
  { bookId: 7, member: ' Ada ', source: 'desk' },
  { bookId: 8, member: ' Bo ', source: 'kiosk' },
  { bookId: 9, member: 'C'.repeat(50), source: 'staff' },
  { bookId: 10, member: 'D'.repeat(41), source: 'desk' },
  { bookId: 11, member: '', source: 'staff' },
]

async function run() {
  for (const item of cases) {
    const response = await fetch('http://localhost:3001/api/loans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    const data = await response.json()
    const answer = response.ok ? JSON.stringify(data.loan.member) : data.error
    console.log(item.source, response.status, answer)
    if (response.status === 201) {
      const returned = await fetch(`http://localhost:3001/api/loans/${data.loan.id}/return`, {
        method: 'POST',
      })
      if (!returned.ok) throw new Error('Could not return the check loan.')
    }
  }
}

run().catch(console.error)
