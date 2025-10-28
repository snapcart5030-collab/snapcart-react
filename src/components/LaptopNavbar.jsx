import { Link, useLocation } from "react-router-dom";
import "./LaptopNavbar.css";
import { useAuth } from "./AuthProvider";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { Like_Url } from "./Api_URL_Page";
import toast, { Toaster } from "react-hot-toast";

function LaptopNavbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { cartItems, fetchCart } = useCart();
  const location = useLocation();

  // ✅ cart count instantly updates on local change
  const totalQuantity = cartItems?.reduce((sum, i) => sum + (i.quantity || 0), 0);

  // ✅ fetch cart when user logs in or changes
  useEffect(() => {
    if (user?.token) fetchCart();
  }, [user?.token]);

  // ✅ live update on every cartItems change
  useEffect(() => {
    // This ensures count refreshes immediately after add/remove
    // without waiting for backend re-fetch.
  }, [cartItems]);

  // ✅ fetch like status once
  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!user?.token) {
        setDisabled(false);
        return;
      }
      try {
        const res = await axios.get(`${Like_Url()}/me`, {
          headers: { Authorization: `Bearer ${user.token}` },
          timeout: 7000,
        });
        setDisabled(!!res.data.liked);
      } catch (err) {
        console.error("Error checking like status:", err);
        toast.error("Failed to fetch like status.");
      }
    };
    fetchLikeStatus();
  }, [user?.token]);

  // ✅ handle like click
  const likeClick = async () => {
    if (!user?.token) {
      toast("You must be logged in to like.", {
        icon: "🔒",
        duration: 2000,
      });
      return;
    }

    try {
      const res = await axios.post(
        Like_Url(),
        { message: "Liked your website" },
        { headers: { Authorization: `Bearer ${user.token}` }, timeout: 7000 }
      );
      toast.success(res.data.msg || "❤️ Liked ");
      setDisabled(true);
    } catch (err) {
      console.error("Like error:", err);
      toast.error(err.response?.data?.msg || "❌ Something went wrong.");
    }
  };

  function emaildropdown() {
    setOpen(!open);
    setTimeout(() => {
      setOpen(false);
    }, 1000);
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div id="user_unsecrcoll">
      <Toaster position="top-center" reverseOrder={false} />

      <nav id="user_unsecrcoll_navbar">
        {/* Left: Logo */}
        <div id="user_unsecrcoll_logo">
          <span className="logo-icon">🛍️</span> SnapCart
        </div>

        {/* Middle: Menu */}
        <ul id="user_unsecrcoll_menu">
          <li className={isActive("/") ? "active-link" : ""}>
            <Link to={"/"}>
              <i className="bi bi-house-fill"></i> Home
            </Link>
          </li>
          <li className={isActive("/search") ? "active-link" : ""}>
            <Link to={"search"}>
              <i className="bi bi-search"></i> Search
            </Link>
          </li>
          <li className={isActive("/categorypc") ? "active-link" : ""}>
            <Link to={"categorypc"}>
              <i className="bi bi-grid"></i> Category
            </Link>
          </li>
          <li className={isActive("/contactpage") ? "active-link" : ""}>
            <Link to={"contactpage"}>
              <i className="bi bi-chat-left-text-fill"></i> Contact
            </Link>
          </li>
          <li className={isActive("/profilepc") ? "active-link" : ""}>
            <Link to={"profilepc"}>
              <i className="bi bi-person-fill"></i> Profile
            </Link>
          </li>

          {user ? (
            <div className="position-relative d-inline-block">
              <span className="text-uppercase" onClick={emaildropdown}>
                {user.email.split("@")[0]}
              </span>

              {open && (
                <div
                  className="dropdown-menu show"
                  style={{ display: "block", position: "absolute" }}
                >
                  <span className="dropdown-item-text">{user.email}</span>
                </div>
              )}
            </div>
          ) : (
            <li className={isActive("/login") ? "active-link" : ""}>
              <Link to={"/login"}>Login</Link>
            </li>
          )}
        </ul>

        {/* Right: Like + Orders + Cart */}
        <div className="cart_orders_container">
          <div className="like_icon">
            <span
              className={`${
                !disabled ? "bi bi-heart" : "text-danger bi bi-heart-fill"
              }`}
              onClick={!disabled ? likeClick : null}
            ></span>
          </div>

          <Link
            to={"myorders"}
            className={`my_order-for_laptop ${
              isActive("/myorders") ? "active-link" : ""
            }`}
          >
            My Orders
          </Link>

          <Link
            to={"cart"}
            className={`cart_icon_for_laptop ${
              isActive("/cart") ? "active-link" : ""
            }`}
          >
            <span className="bi bi-basket"></span>
            <div
              className="cart_badge"
              style={{
                backgroundColor: totalQuantity > 0 ? "#ff4d4d" : "#ff4d4d",
              }}
            >
              {totalQuantity}
            </div>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default LaptopNavbar;
