export default function LoanBadge({ loan }) {
  if (!loan) return <span className="status-tag available">Available</span>
  return (
    <span className="loan-detail">
      <span className="status-tag on-loan">On loan</span>
      <span>{loan.member} · Due {loan.dueDate.toLocaleDateString()}</span>
    </span>
  )
}
