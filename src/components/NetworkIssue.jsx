import './NetworkIssue.css';

function NetworkIssue() {
  return (
    <div className="mynetwork_proble_5">
      <div className="network__container">
        <div className="network__animation">
          <div className="network__signal">
            <div className="network__bar network__bar--1"></div>
            <div className="network__bar network__bar--2"></div>
            <div className="network__bar network__bar--3"></div>
            <div className="network__bar network__bar--4"></div>
            <div className="network__bar network__bar--5"></div>
          </div>
          <div className="network__wifi">
            <div className="network__ring network__ring--1"></div>
            <div className="network__ring network__ring--2"></div>
            <div className="network__ring network__ring--3"></div>
          </div>
        </div>
        
        <div className="network__content">
          <h1 className="network__title">Connection Lost</h1>
          <p className="network__message">
            Oops! It seems you're having some network issues. 
            Please check your internet connection and try again.
          </p>
          <div onClick={() => window.location.reload()} className="network__suggestions">
            <div className="network__tip">
              <span  className="network__tip-icon">📶</span>
              Check your Wi-Fi or mobile data & Refresh 
            </div>
          </div>
          <button 
            className="network__retry-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default NetworkIssue;