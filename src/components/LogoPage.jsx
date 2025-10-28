import './LogoPage.css';

const LogoPage = () => {
  return (
    <div className="logo-wrapper">
      <div className="cart-icon">
        <div className="cart-handle"></div>
        <div className="cart-body"></div>
        <div className="cart-wheel left"></div>
        <div className="cart-wheel right"></div>
      </div>
      <h1 className="logo-text">Snap<span>Cart</span></h1>
    </div>
  );
};

export default LogoPage;
