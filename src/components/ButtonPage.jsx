import { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "./CartProvider";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Cart_Url,
  AddToCart_Url,
  RemoveFromCart_Url,
} from "./Api_URL_Page";
import "./ButtonPage.css";

export default function ButtonPage({ productId, user, productName }) {
  const [added, setAdded] = useState(false);
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [anim, setAnim] = useState("");
  const { cartItems, fetchCart } = useCart();
  const navigate = useNavigate();

  const toastId = "cart-toast";

  // ✅ Reset animation after fade-out
  useEffect(() => {
    if (anim === "fade-out") {
      const timer = setTimeout(() => setAnim(""), 300);
      return () => clearTimeout(timer);
    }
  }, [anim]);

  // ✅ Fetch initial cart quantity once
  useEffect(() => {
    if (!user?.token) return;
    (async () => {
      try {
        const { data } = await axios.get(Cart_Url(), {
          headers: { Authorization: `Bearer ${user.token}` },
          timeout: 8000, // ⏱ timeout protection
        });
        const item = data.items.find((i) => i.productId === productId);
        setAdded(!!item);
        setCount(item ? item.quantity : 1);
      } catch (err) {
        console.error("Cart fetch failed:", err.message);
        setAdded(false);
        setCount(1);
      }
    })();
  }, [productId, user?.token]);

  // ✅ Core cart handler (no lag version)
  const handleCart = async (url, qtyChange, remove = false) => {
    if (!user) {
      toast.error("Please login to manage your cart.", {
        position: "top-center",
        duration: 2000,
      });
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      // 🧠 instant UI feedback (optimistic update)
      setCount((c) => Math.max(1, c + qtyChange));
      if (remove && count === 1) setAdded(false);
      else setAdded(true);
      setAnim(remove ? "fade-out" : "fade-in");

      // 🧾 backend update
      await axios.post(
        url,
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${user.token}` }, timeout: 8000 }
      );

      // 🔄 background cart refresh (non-blocking)
      fetchCart();

      // ✅ Single toast logic
      if (!remove) {
        const totalItems =
          (cartItems?.reduce((sum, i) => sum + (i.quantity || 0), 0) || 0) + 1;

        toast.custom(
          (t) => (
            <div
              className={`rounded-4 text-white shadow-lg px-4 py-3 flex flex-col items-center gap-2 ${
                t.visible ? "animate-slide-in" : "animate-slide-out"
              }`}
              style={{
                background: "#00b761",
              }}
            >
              <button
                onClick={() => {
                  toast.dismiss(toastId);
                  navigate("/cart");
                }}
                className="btn p-2 fw-bold text-light px-3 py-1 text-sm"
              >
                <span className="">{totalItems}</span>{" "}
                item{totalItems > 1 ? "s" : ""} added to cart →
              </button>
            </div>
          ),
          {
            id: toastId,
            position: "bottom-center",
            duration: 3000,
          }
        );
      } else {
        toast("🗑️ Item removed from cart.", {
          icon: "🛒",
          position: "bottom-right",
          duration: 2000,
        });
      }
    } catch (err) {
      console.error("Cart error:", err.response?.data || err.message);
      toast.error(err.response?.data?.msg || "Cart update failed", {
        position: "bottom-right",
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ UI Section
  return (
    <div className="buttonpage-container">
      {added ? (
        <div className={`button-group ${anim}`}>
          <button
            onClick={() =>
              count === 1
                ? handleCart(RemoveFromCart_Url(), -1, true)
                : handleCart(RemoveFromCart_Url(), -1)
            }
            id="minus_button"
            className={`bi ${count === 1 ? "bi-trash-fill" : "bi-dash-lg"}`}
            disabled={loading}
          ></button>

          <div className="count-wrapper">
            {loading && <div className="spin-circle" />}
            <span className="count-text">{count}</span>
          </div>

          <button
            onClick={() => handleCart(AddToCart_Url(), +1)}
            id="plus_button"
            className="bi bi-plus-lg"
            disabled={loading}
          ></button>
        </div>
      ) : (
        <button
          id="addtocart_button"
          onClick={() => handleCart(AddToCart_Url(), 0)}
          className={`add-button ${anim === "fade-out" ? "fade-in" : ""}`}
          disabled={loading}
        >
          {loading ? <span style={{ fontSize: "15px" }}>Adding...</span> : "Add"}
        </button>
      )}
    </div>
  );
}
