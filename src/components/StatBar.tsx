type StatBarProps = {
  label: string
  value: number
  // The biggest value of the group: its bar is full width, the others are a share of it.
  max: number
  color?: string
}

// One row: the label, a CSS bar as long as the value, and the number.
function StatBar({ label, value, max, color = 'var(--muted)' }: StatBarProps) {
  const percent = max === 0 ? 0 : (value / max) * 100
  return (
    <div className="stat-bar">
      <span className="stat-bar-label">{label}</span>
      <div className="stat-bar-track" aria-hidden="true">
        <div className="stat-bar-fill" style={{ width: `${percent}%`, background: color }} />
      </div>
      <span className="stat-bar-value">{value}</span>
    </div>
  )
}

export default StatBar
