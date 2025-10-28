import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./BottomNavbar.css";

function BottomNavbar() {
  const [show, setShow] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > lastScroll) {
        setShow(false);
      } else {
        setShow(true);
      }
      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  // Function to check if current path is active
  const isActive = (path) => location.pathname === path;

  return (
    <div
      className="my_bottom_navbar_wrapper_3"
      style={{
        transform: show ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.3s ease-in-out",
      }}
    >
      <Link to="/" className="my_bottom_navbar_item_3">
        <i
          className={
            isActive("/")
              ? "bi bi-house-fill my_bottom_navbar_houseicon_3"
              : "bi bi-house my_bottom_navbar_houseicon_3"
          }
        ></i>
        <span className="my_bottom_navbar_text_3">Home</span>
      </Link>

      <Link to="/categorypc" className="my_bottom_navbar_item_3">
        <i
          className={
            isActive("/categorypc")
              ? "bi bi-grid-fill my_bottom_navbar_profileicon_3"
              : "bi bi-grid my_bottom_navbar_profileicon_3"
          }
        ></i>
        <span className="my_bottom_navbar_text_3">Category</span>
      </Link>

      {/* <Link to="/offers" className="my_bottom_navbar_item_3">
        <i
          className={
            isActive("/offers")
              ? "bi bi-tags-fill my_bottom_navbar_offresicon_3"
              : "bi bi-tags my_bottom_navbar_offresicon_3"
          }
        ></i>
        <span className="my_bottom_navbar_text_3">Offers</span>
      </Link> */}

      <Link to="/contactpage" className="my_bottom_navbar_item_3">
        <span
          className={
            isActive("/contactpage")
              ? "bi bi-telephone-fill my_bottom_navbar_carticon_3"
              : "bi bi-telephone my_bottom_navbar_carticon_3"
          }
        ></span>
        <span className="my_bottom_navbar_text_3">Contact</span>
      </Link>
        

        
       <Link to="https://zestorecom.web.app" className="my_bottom_navbar_item_3">
        <span
          className={"bi  my_bottom_navbar_carticon_3"}
        >Zestore</span>
        <span className="my_bottom_navbar_text_3">Visit</span>
      </Link>

    </div>
  );
}

export default BottomNavbar;
