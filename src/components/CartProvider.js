import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthProvider";
import { Cart_Url, AddToCart_Url, RemoveFromCart_Url } from "./Api_URL_Page";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart from backend
  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await axios.get(Cart_Url(), {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCartItems(res.data.items || []);
    } catch {}
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  // Add item
  const addToCart = async (productId, quantity = 1) => {
    if (!user) return;
    try {
      await axios.post(
        AddToCart_Url(),
        { productId, quantity },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setCartItems((prev) => {
        const existing = prev.find((i) => i.productId === productId);
        if (existing) {
          return prev.map((i) =>
            i.productId === productId
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        } else {
          return [...prev, { productId, quantity }];
        }
      });
    } catch {}
  };

  // Remove item
  const removeFromCart = async (productId) => {
    if (!user) return;
    try {
      await axios.delete(`${RemoveFromCart_Url()}/${productId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCartItems((prev) => prev.filter((i) => i.productId !== productId));
    } catch {}
  };

  return (
   <CartContext.Provider
  value={{ cartItems, setCartItems, addToCart, removeFromCart, fetchCart }}
>

      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
