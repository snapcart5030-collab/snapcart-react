import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useCart } from "./CartProvider";
import axios from "axios";
import "./MobileNavbar.css";
import imageList from "./ImageSave";
import { Like_Url } from "./Api_URL_Page";
import toast from "react-hot-toast";

function MobileNavbar() {
  const { user } = useAuth();
  const { cartItems, fetchCart } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [textColor, setTextColor] = useState({});
  const [liked, setLiked] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const totalQuantity = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  // 🖼️ Carousel
  useEffect(() => {
    let direction = 1;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        let next = prev + direction;
        if (next >= imageList.length - 1) direction = -1;
        if (next <= 0) direction = 1;
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 🧭 Scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setTextColor({ color: scrollY > 0 ? "black" : "white" });
      setShowSearchBar(scrollY <= prevScrollPos);
      setPrevScrollPos(scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  // 🛒 Fetch Cart when user changes
  useEffect(() => {
    fetchCart();
  }, [user]);
  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!user) {
        setDisabled(false);
        return;
      }
      try {
        const res = await axios.get(`${Like_Url()}/me`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (res.data.liked) setDisabled(true);
      } catch (err) {
        console.error("Error checking like status:", err);
        toast.error("Failed to fetch like status.");
      }
    };
    fetchLikeStatus();
  }, [user]);

  const likeClick = async () => {
    if (!user) {
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
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success(res.data.msg || "❤️ Liked successfully!");
      setDisabled(true);
    } catch (err) {
      console.error("Like error:", err);
      toast.error(err.response?.data?.msg || "❌ Something went wrong.");
    }
  };


const switchlogin = () => {
  if (!user) {
    toast("You must login first", {
      icon: "🔒",
      duration: 2000,
    });
    return;
  }

  // Here you can toggle your switch state
  setDisabled(!disabled); // or whatever logic you want
  toast.success(`Switch turned ${!disabled ? "ON" : "OFF"}`);
};



  return (
    <div className="mobile-navbarwwwww">

      {/* Carousel */}
      <div className="carousel-containerwwwww">
        <div
          className="carousel-inner-customwwwww"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {imageList.map((src, i) => (
            <div key={i} className="carousel-slide-customwwwww">
              <img src={src} alt={`slide-${i}`} />
              <div className="carousel-overlaywwwww"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Navbar Top */}
      <div className="navbar-top-rowwwwww">
        <div className="top-row d-flex justify-content-between align-items-center px-3 py-2">
          <span style={textColor} className="bi bi-list fs-1 top_menu_style"></span>

          <div className="top-iconswwwww d-flex align-items-center gap-4">
            <span
              className={` top_menu_style ${!disabled ? "bi bi-heart" : " text-danger bi bi-heart-fill"}`}
              onClick={!disabled ? likeClick : null}
            ></span>

            <Link to={'/profilepc'}>
              <span style={textColor} className="bi bi-person-circle top_menu_style"></span>
            </Link>

            <div className="cart-iconwwwww">
              <Link to="cart" style={textColor} className="bi bi-cart3 top_menu_style">
                <span className="cart-badge" style={{ backgroundColor: "red" }}>
                  {totalQuantity}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className={`search-sectionwwwww px-3 py-2 ${showSearchBar ? "visible" : "hidden"}`}>
        <div className="bottom-row d-flex align-items-center">
          <div className="search-boxwwwww d-flex align-items-center px-3">
            <span style={{ color: "#8e2de2" }} className="bi bi-search fs-4 me-2 "></span>
            <input className="w-75" type="text" placeholder="Search..." />
            <span style={{ color: "#8e2de2" }} className="bi bi-mic-fill fs-4 ms-auto"></span>
          </div>

          <div className="veg-modewwwww d-flex flex-column align-items-center ms-1">
            <label className="form-check-label text-white">Electronics</label>
            <div

              className="form-check form-switch custom-switch"
            >
              <input className="form-check-input" type="checkbox" disabled={!user}
                checked={disabled}
                onChange={switchlogin} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileNavbar;
