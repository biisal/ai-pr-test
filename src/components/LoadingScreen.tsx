export function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-bg">
        <div className="loading-stars" />
      </div>
      <div className="loading-content">
        <div className="loading-solar-system">
          <div className="loading-sun">
            <div className="loading-sun-core" />
            <div className="loading-sun-glow" />
          </div>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="loading-orbit"
              style={{
                width: `${(i + 1) * 28}px`,
                height: `${(i + 1) * 28}px`,
                animationDelay: `${i * 0.15}s`
              }}
            >
              <div
                className="loading-planet"
                style={{
                  width: `${4 + Math.random() * 4}px`,
                  height: `${4 + Math.random() * 4}px`,
                  animationDelay: `${-i * 0.3}s`
                }}
              />
            </div>
          ))}
        </div>
        <div className="loading-text">
          <h1 className="loading-title">SOLARIS</h1>
          <p className="loading-subtitle">Loading the Solar System...</p>
          <div className="loading-bar">
            <div className="loading-bar-fill" />
          </div>
        </div>
      </div>
    </div>
  )
}