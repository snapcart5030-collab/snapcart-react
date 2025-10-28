import "./PcCategoryShimmer.css";

function PcCategoryShimmer() {
  const shimmerArray = Array(14).fill(0); // create 8 shimmer cards

  return (
    <div id="categoryShimmerContainer">
      {shimmerArray.map((_, index) => (
        <div id="categoryShimmerCard" key={index}>
          <div id="categoryShimmerImage"></div>
          <div id="categoryShimmerTitle"></div>
        </div>
      ))}
    </div>
  );
}

export default PcCategoryShimmer;
