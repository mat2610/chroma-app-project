// Grey placeholder cards shown while the artworks are loading.
const SKELETONS = [1, 2, 3, 4, 5, 6, 7, 8]

function Loader() {
  return (
    <div className="gallery" aria-label="Loading artworks">
      {SKELETONS.map((number) => (
        <div key={number} className="skeleton-card">
          <div className="skeleton-image" />
          <div className="skeleton-line" />
          <div className="skeleton-line skeleton-line-short" />
        </div>
      ))}
    </div>
  )
}

export default Loader
