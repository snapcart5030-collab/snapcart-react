import './RefreshLoader.css';

function RefreshLoader() {
  return (
    <div className="shimmer-container">
      <div className="hero-shimmer2"></div>
      <div className="hero-shimmer"></div>

      <div className="categories-shimmer">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="category-item">
            <div className="category-icon"></div>
            <div className="category-text"></div>
          </div>
        ))}
      </div>
      <div className="website-title">Snapcart</div> 
    </div>
  );
}

export default RefreshLoader;