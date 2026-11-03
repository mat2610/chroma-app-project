import type { ArtworkKind } from '../types'
import { KIND_COLORS } from '../utils/artworks'

// "all" is not a kind: it means no kind filter.
export type KindChoice = ArtworkKind | 'all'

type KindFilterProps = {
  value: KindChoice
  onChange: (value: KindChoice) => void
}

// We only load the five main kinds, so 'other' would always be empty: no chip for it.
const KINDS = (Object.keys(KIND_COLORS) as ArtworkKind[]).filter((kind) => kind !== 'other')

// 'painting' → 'Painting'
function label(kind: KindChoice): string {
  return kind.charAt(0).toUpperCase() + kind.slice(1)
}

// One chip per kind, "All" first. The chip of the chosen kind is marked as pressed.
function KindFilter({ value, onChange }: KindFilterProps) {
  const choices: KindChoice[] = ['all', ...KINDS]
  return (
    <div className="kind-filter">
      {choices.map((choice) => (
        <button
          key={choice}
          type="button"
          className="kind-chip"
          aria-pressed={choice === value}
          onClick={() => onChange(choice)}
        >
          {choice !== 'all' && (
            <span className="kind-chip-dot" style={{ background: KIND_COLORS[choice] }} />
          )}
          {label(choice)}
        </button>
      ))}
    </div>
  )
}

export default KindFilter
