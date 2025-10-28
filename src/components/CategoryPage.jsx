import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AxiosFetchData_File } from "./AxiosFetchData_File";
import "./CategoryPage.css";
import CategoryShimmer from "./CategoryShimmer";

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (categories.length) setIsLoading(false);
  }, [categories]);

  // Get active category from URL
  const getActiveCategoryFromURL = () => {
    const path = decodeURIComponent(location.pathname.slice(1)); // decode URL
    return path ? path.toLowerCase() : "all"; // default to 'all'
  };

  const activeCategory = getActiveCategoryFromURL();

  const handleCategoryClick = (catName) => {
    if (catName.toLowerCase() === "all") {
      navigate("/"); // root for "All"
    } else {
      navigate(`/${encodeURIComponent(catName)}`);
    }
  };

  const categoriesWithAll = [{ name: "All", catimg: "https://img.freepik.com/free-vector/charming-cartoon-house-illustration_1308-176076.jpg?semt=ais_hybrid&w=740&q=80" }, ...categories];

  return (
    <div className="category-page-wrappersssss">
      <AxiosFetchData_File setCategories={setCategories} />
      {isLoading ? (
        <CategoryShimmer />
      ) : (
        <ul className="category-list-horizontalsssss">
          {categoriesWithAll.map((cat, idx) => (
            <li
              key={idx}
              className={`category-itemsssss ${
                activeCategory === cat.name.toLowerCase() ? "active-category" : ""
              }`}
              onClick={() => handleCategoryClick(cat.name)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={cat.catimg}
                className="category-imgsssss"
                id={`category-img-id-${idx}`}
              />
              <span className="category-namesssss">{cat.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CategoryPage;
