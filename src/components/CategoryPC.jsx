import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ← Add this
import { AxiosFetchData_File } from "./AxiosFetchData_File";
import "./CategoryPC.css";
import PcCategoryShimmer from "./PcCategoryShimmer";

function CategoryPC() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (categories.length) setIsLoading(false);
  }, [categories]);

  return (
    <div className="categorypc_wrapper_1">
      <AxiosFetchData_File setCategories={setCategories} />
      <h2 className="categorypc_title_1">  All Product Categories</h2>
      <div className="categorypc_grid_1">
        {isLoading ? (
          <p className="categorypc_loading_1"> 
             <PcCategoryShimmer/>
           </p>
        ) : (
          categories.map((cat, idx) => (
            <div
              className="categorypc_card_1"
              key={idx}
              onClick={() => navigate(`/${cat.name.toLowerCase()}`)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={cat.logo}
                alt={cat.name}
                className="categorypc_img_1"
                id={`categorypc_img_id_${idx}`}
              />
              <p className="categorypc_name_1">{cat.name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CategoryPC;
