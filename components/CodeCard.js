export default function CodeCard({ title, language, code }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <small>{language}</small>
      <pre>{code}</pre>
    </div>
  )
}
