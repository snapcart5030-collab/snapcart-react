import { useEffect, useState } from "react";
import "./Products_Shimmer.css";

function ShimmerPage() {
  const shimmerCards = Array(30).fill(0);
  const [loadingText, setLoadingText] = useState("");
  const [checkNetwork, setCheckNetwork] = useState("");

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setLoadingText("Loading..");
    }, 2500);

    return () => clearTimeout(timer1);
  }, []);

  useEffect(() => {
    const timer2 = setTimeout(() => {
      setLoadingText("");
      setCheckNetwork("Check Network Connection ! ");
    }, 4000);

    return () => clearTimeout(timer2);
  }, []);

  return (
    <div id="shop_wrappscroll" className="">
      <div className="row g-2">
        {shimmerCards.map((_, index) => (
          <div className="col-4 col-sm-3 col-md-2" id="card_boxscroll" key={index}>
            <div id="shimmer_card">
              <div id="shimmer_img">
                <div id="loading_text_cards" className="mt-4 py-1">
                  {loadingText}
                  <span style={{ fontSize: "9px" }}>{checkNetwork}</span>
                </div>
              </div>
              <div id="shimmer_title"></div>
              <div id="shimmer_rating"></div>
              <div id="shimmer_price"></div>
              <div id="shimmer_desc">
              <div id="shimmer_line"></div>
              <div id="shimmer_line"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShimmerPage;
