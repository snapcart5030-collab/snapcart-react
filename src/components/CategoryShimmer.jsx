import { useEffect, useState } from "react";
import "./CategoryShimmer.css";

function CategoryShimmer() {
  const shimmerItems = Array(15).fill(0);
  const [loading ,setLoading]=useState()
  
  useEffect(()=>{
    setTimeout(() => {
      setLoading('Loading')
    }, 1500);
  },[])

  return (
    <div className="category-page-wrapperssssswwww">
      <div className="category-scroll-containerssssswwww">
        <ul className="category-list-horizontalssssswwww">
          {shimmerItems.map((_, index) => (
            <li key={index} className={`category-itemssssswwww item-${index}`}>
              <div className={`category-imgssssswwww d-flex align-items-center justify-content-center shimmerwwww img-${index}`}> <span className="fs-6 text-center">{loading}</span> </div>
              <div className={`category-namessssswwww shimmerwwww shimmer-textwwww name-${index}`}></div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CategoryShimmer;
