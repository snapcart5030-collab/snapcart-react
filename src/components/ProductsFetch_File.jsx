import ButtonPage from "./ButtonPage";
import ShimmerPage from "./Products_Shimmer";
import "./ProductsFetch_File.css";

function ProductsFetch_File({ products }) {
  const isLoading = !products || products.length === 0;

  return (
    <div id="shop_wrappscroll" className="container-fluid">
      {isLoading ? (
        <ShimmerPage />
      ) : (
        <div className="row g-0">
          {products.map((item, index) => (
            <div
              className="col-4 col-sm-3 col-md-2"
              id="card_boxscroll"
              key={index}
            >
              <div id="card_headscroll">
                <img id="card_imgscroll" src={item.image} alt={item.title} />
              </div>

              <div id="card_titlescroll">{item.title}</div>

              <div id="card_ratingscroll">
                ⭐⭐⭐<span className="fs-6">☆☆</span>
              </div>

              <div id="card_priceboxscroll">
               <span id="card_oldpricescroll">₹{item.price.toString().slice(0,5)}</span>
                <span id="card_newpricescroll"> &nbsp; ₹{item.price}</span>
              </div>

              <ButtonPage product={item} />

              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductsFetch_File;
