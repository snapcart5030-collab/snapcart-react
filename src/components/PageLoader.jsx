import './PageLoader.css';

function PageLoader() {
  return (
    <div id="page-overlay">
      <div id="circle-loader">
        <div id="loader-container">
          <div id="gift-box">
            <i className="bi bi-gift-fill "></i>
          </div>
          <div id="truck-box">
            <img width={220} src="/image/wan.png" alt="truck" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageLoader;
