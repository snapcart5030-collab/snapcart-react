import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useCart } from "./CartProvider";
import axios from "axios";
import { toast } from "react-hot-toast"; // ✅ using react-hot-toast now

import BatteryError from "./BatteryError"; // ✅ import BatteryError

import {
  Cart_Url,
  AddToCart_Url,
  RemoveFromCart_Url,
  Orders_Url,
  ConfirmOrder_Url,
} from "./Api_URL_Page";
import EmptyCart from "./EmptyCart";

function CartPage() {
  const [cookies] = useCookies(["token"]);
  const [loadingIds, setLoadingIds] = useState([]);
  const navigate = useNavigate();
  const [batteryLow, setBatteryLow] = useState(false); // track battery low
  const [showBatteryError, setShowBatteryError] = useState(false); // show BatteryError component
  const { cartItems, fetchCart, addToCart, removeFromCart, setCartItems } =
    useCart();

  useEffect(() => {
    if (!cookies.token) {
      toast.error("Please login first to access the cart.", {
        position: "top-center",
      });
      navigate("/login");
    } else {
      fetchCart();
    }
  }, [cookies, navigate, fetchCart]);

  const TOAST_ID = "cart-toast";

  // ✅ Increase quantity
  const increment = async (productId, productName) => {
    setLoadingIds((prev) => [...prev, productId]);
    try {
      await axios.post(
        AddToCart_Url(),
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${cookies.token}` } }
      );

      fetchCart();

      toast.dismiss(TOAST_ID); // dismiss previous
      toast.success(`${productName || "Item"} quantity increased!`, {
        id: TOAST_ID,
        position: "bottom-right",
      });
    } catch (err) {
      console.error(err);
      toast.dismiss(TOAST_ID);
      toast.error("Failed to increase quantity.", {
        id: TOAST_ID,
        position: "bottom-right",
      });
    }
    setLoadingIds((prev) => prev.filter((id) => id !== productId));
  };

  // ✅ Remove item manually (Remove button)
  const handleRemove = async (productId) => {
    setLoadingIds((prev) => [...prev, productId]);
    try {
      await axios.post(
        RemoveFromCart_Url(),
        { productId },
        { headers: { Authorization: `Bearer ${cookies.token}` } }
      );
      setCartItems((prev) => prev.filter((item) => item.productId !== productId));
      toast.success(`Item removed from cart.`, { id: TOAST_ID, position: "bottom-right" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item.", { position: "bottom-right" });
    }
    setLoadingIds((prev) => prev.filter((id) => id !== productId));
  };

  // ✅ Place Order + Trigger Tracking API
  // ✅ Place Order + Trigger Tracking API
const handleOrderNow = async () => {
  // ✅ Check battery before order
  if ("getBattery" in navigator) {
    const battery = await navigator.getBattery();
    if (battery.level <= 0.2) {
      setBatteryLow(true);
      setShowBatteryError(true);
      toast.error("Battery < 20% — please charge your phone", {
        position: "top-center",
      });
      navigate("/batery");
      return;
    } else {
      setBatteryLow(false);
      setShowBatteryError(false);
    }
  }

  // ✅ Require at least 3 items in cart
  if (cartItems.length < 3) {
    return toast.error("Please add at least 3 items before Ordering.", {
      position: "top-center",
    });
  }

  if (!("geolocation" in navigator)) {
    return toast.error("Geolocation is not supported in your browser.", {
      position: "top-center",
    });
  }

  toast.loading("Fetching your location...", { position: "top-center" });

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      toast.dismiss();
      const { latitude, longitude } = position.coords;
      const address = `Lat: ${latitude}, Lng: ${longitude}`;

      try {
        const res = await axios.post(
          `${Orders_Url()}/checkout`,
          { latitude, longitude, address },
          { headers: { Authorization: `Bearer ${cookies.token}` } }
        );

        const order = res.data.order;
        toast.success("✅ Order placed successfully!", {
          position: "top-center",
        });

        setCartItems([]);
        await axios.post(ConfirmOrder_Url(), {
          orderId: order._id,
          userEmail: order.userEmail,
        });

        localStorage.setItem("lastOrderId", order._id);
        navigate("/myorders");
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.msg || "Failed to place order.", {
          position: "bottom-right",
        });
      }
    },
    (error) => {
      toast.dismiss();
      if (error.code === error.PERMISSION_DENIED) {
        toast.error("Please allow location access before placing the order.", {
          position: "top-center",
        });
      } else {
        toast.error("Unable to fetch location. Please try again.", {
          position: "top-center",
        });
      }
    }
  );
};


  if (!cookies.token) return null;

  return (
    <div className=" container-fluid mt-5">
      {cartItems.length === 0 ? (
        <div> <EmptyCart/> </div>
      ) : (
        <table className="table">
           <h2>Your Carts</h2>
          <thead>
            <tr>
              <th>Product</th>
              <th>Image</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.productId}>
                <td>{item.productName}</td>
                <td>
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </td>
                <td>₹{item.productPrice}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <button
                      onClick={() => handleRemove(item.productId)}
                      disabled={loadingIds.includes(item.productId)}
                      className={`btn btn-sm ${
                        item.quantity === 1 ? "btn-danger" : "btn-secondary"
                      }`}
                    >
                      {item.quantity === 1 ? "🗑" : "-"}
                    </button>

                    <span className="mx-2">
                      {loadingIds.includes(item.productId) ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : (
                        item.quantity
                      )}
                    </span>

                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => increment(item.productId)}
                      disabled={loadingIds.includes(item.productId)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>₹{item.productPrice * item.quantity}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleRemove(item.productId)}
                    disabled={loadingIds.includes(item.productId)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {cartItems.length > 0 && (
        <div className="mt-3">
          <button
          style={{
          background: "#00b761",
        }}
          
          className="btn text-light " onClick={handleOrderNow}>
            Order Now <span className="text-light fw-bold">{cartItems.length}</span> items
          </button>
        </div>
      )}
    </div>
  );
}

export default CartPage;
