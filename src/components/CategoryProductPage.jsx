import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthProvider";
import ButtonPage from "./ButtonPage";
import { AllCategoriesApi_URL } from "./Api_URL_Page";
import "./CategoryProductPage.css";
import { useLocation } from "react-router-dom";
import ShimmerPage from "./Products_Shimmer";
import PageLoader from "./PageLoader";

export default function CategoryProductPage({ category }) {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [subcats, setSubcats] = useState([]);
  const [selected, setSelected] = useState("All");
  const [loading, setLoading] = useState(true); // for main category/products
  const [subcatLoading, setSubcatLoading] = useState(true); // for subcategories
  const [sticky, setSticky] = useState(false);
  const location = useLocation();
  const initialSub = location.state?.subcategory || "All";

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setSubcatLoading(true);

        const catRes = await axios.get(`${AllCategoriesApi_URL()}/${category}`);
        const subRes = await axios.get(`${AllCategoriesApi_URL()}/${category}/subcategories`);

        setData(catRes.data.subcategories || []);
        setSubcats(subRes.data.subcategories || []);
      } catch (error) {
        console.error("Error fetching category data:", error);
        setData([]);
        setSubcats([]);
      } finally {
        setLoading(false);
        setSubcatLoading(false);
      }
    })();
  }, [category]);

  // Sticky scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) setSticky(true);
      else setSticky(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filtered =
    selected === "All"
      ? data
      : data.filter((s) => s.name.toLowerCase() === selected.toLowerCase());

  if (loading)
    return (
      <div className="my_fruits_loading_11">
        <PageLoader />
      </div>
    );

  return (
    <div className="my_fruits_container_11 container-fluid">
      {/* Subcategory filter bar */}
      <div className={`my_fruits_subcat_list_11 ${sticky ? "sticky-bar" : ""}`}>
        {subcatLoading ? (
          <div className="my_fruits_subcat_loading_text_11">
            Loading subcategories...
          </div>
        ) : subcats.length > 0 ? (
          <div className="my_fruits_subcat_scroll_11">
            {["All", ...subcats.map((s) => s.name)].map((name) => (
              <span
                key={name}
                onClick={() => setSelected(name)}
                className={`my_fruits_subcat_item_11 ms-2 ${
                  selected === name ? "active" : ""
                }`}
              >
                {name} <span className="bi bi-chevron-down"></span>
              </span>
            ))}
          </div>
        ) : (
          <div className="my_fruits_subcat_loading_text_11">
            No subcategories found.
          </div>
        )}
      </div>

      {/* Product display */}
      {filtered.map((sub) => (
        <div key={sub.name} className="my_fruits_section_11">
          {selected === "All" && (
            <h2 className="my_fruits_title_11">{sub.name}</h2>
          )}
          <div className="my_fruits_grid_11">
            {sub.products?.map((p) => (
              <ProductCard key={p._id} p={p} user={user} />
            ))}
          </div>
        </div>
      ))}

      {!filtered.length && (
        <div className="my_fruits_empty_11">
          <ShimmerPage />
        </div>
      )}
    </div>
  );
}

function ProductCard({ p, user }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="my_fruits_card_11">
      <div className="my_fruits_img_wrapper_11">
        {!loaded && <div className="my_fruits_img_shimmer_11" />}
        <img
          src={p.productImage}
          alt={p.productName}
          onLoad={() => setLoaded(true)}
          onError={() => console.warn("Image failed to load:", p.productImage)}
          className={`my_fruits_img_11 ${loaded ? "visible" : "hidden"}`}
        />
      </div>

      <h4 className="my_fruits_name_11">{p.productName}</h4>
      <div className="d-flex justify-content-around">
        <del className="my_fruits_price_11 text-danger">
          ₹{p.productPrice + 20}
        </del>
        <p className="my_fruits_price_11">₹{p.productPrice}</p>
      </div>
      <ButtonPage productName={p.productName} productId={p._id} user={user} />
      <p className="my_fruits_disc_11 bi bi-tag-fill">{p.productDisc}</p>
    </div>
  );
}
