type SearchBarProps = {
  value: string
  onChange: (value: string) => void
}

// A controlled input: it shows the value it gets, and sends every change up to its parent.
function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      className="search-bar"
      type="search"
      placeholder="Search by title or artist"
      aria-label="Search by title or artist"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

export default SearchBar
