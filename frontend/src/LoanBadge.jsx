export default function LoanBadge({ loan }) {
  if (!loan) return <span className="pill available">Available</span>
  return (
    <span className="loan-detail">
      <span className="pill on-loan">On loan</span>
      <span>{loan.member}</span>
      <span>Due {loan.dueDate.toLocaleDateString()}</span>
    </span>
  )
}
