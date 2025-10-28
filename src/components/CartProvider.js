import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthProvider";
import { Cart_Url, AddToCart_Url, RemoveFromCart_Url } from "./Api_URL_Page";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch cart from backend
  const fetchCart = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const res = await axios.get(Cart_Url(), {
        headers: { Authorization: `Bearer ${user.token}` },
        timeout: 7000, // prevent hanging requests
      });
      setCartItems(res.data?.items || []);
    } catch (err) {
      console.error("🛒 Fetch cart failed:", err.message);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial load when user logs in/out
  useEffect(() => {
    if (user?.token) fetchCart();
    else setCartItems([]);
  }, [user?.token]);

  // ✅ Add item instantly + background sync
  const addToCart = async (productId, quantity = 1) => {
    if (!user?.token) return;

    // 🧠 Instant local UI update
    setCartItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { productId, quantity }];
    });

    // 🔄 Backend sync (non-blocking)
    axios
      .post(
        AddToCart_Url(),
        { productId, quantity },
        {
          headers: { Authorization: `Bearer ${user.token}` },
          timeout: 7000,
        }
      )
      .then(() => fetchCart())
      .catch((err) => {
        console.error("Add to cart failed:", err.message);
        // Try to re-sync if failed
        fetchCart();
      });
  };

  // ✅ Remove or decrease item instantly
  const removeFromCart = async (productId, removeAll = false) => {
    if (!user?.token) return;

    setCartItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: removeAll
                  ? 0
                  : Math.max(0, item.quantity - 1),
              }
            : item
        )
        .filter((i) => i.quantity > 0)
    );

    // 🔄 Backend update (async, no UI block)
    axios
      .delete(`${RemoveFromCart_Url()}/${productId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
        timeout: 7000,
      })
      .then(() => fetchCart())
      .catch((err) => {
        console.error("Remove from cart failed:", err.message);
        fetchCart();
      });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        fetchCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
