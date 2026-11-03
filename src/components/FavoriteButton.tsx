type FavoriteButtonProps = {
  isFavorite: boolean
  onToggle: () => void
}

// A heart: full when the artwork is a favorite, empty when not. The click is sent up to the parent.
function FavoriteButton({ isFavorite, onToggle }: FavoriteButtonProps) {
  return (
    <button
      type="button"
      className="favorite-button"
      aria-pressed={isFavorite}
      onClick={onToggle}
    >
      <span aria-hidden="true">{isFavorite ? '♥' : '♡'}</span>
      {isFavorite ? 'In favorites' : 'Add to favorites'}
    </button>
  )
}

export default FavoriteButton
