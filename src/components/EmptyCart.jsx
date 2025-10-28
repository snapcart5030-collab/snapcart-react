import { Link } from "react-router-dom";
import "./EmptyCart.css"; // We'll create this CSS

function EmptyCart() {
  return (
    <div className="empty_cart_container">
      <div className="empty_cart_box">
        <img
          src="/image/emptycart.jpg"
          alt="Empty Cart"
          className="empty_cart_img"
        />
       
         <h2>Your Cart is Empty</h2>
        <div>Looks like you haven't added anything to your cart yet. </div>
       
        <Link to="/" className="continue_shopping_btn">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default EmptyCart;
