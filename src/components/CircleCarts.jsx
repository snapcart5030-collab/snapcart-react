import { useState, useEffect } from "react";
import "./CircleCarts.css";
import ButtonPage from "./ButtonPage";

const products = [
  { id: 1, img: "/image/cartblue.png", name: "Product 1" },
  { id: 2, img: "/image/diwali.png", name: "Product 2" },
  { id: 3, img: "/path/to/img3.png", name: "Product 3" },
  { id: 4, img: "/path/to/img4.png", name: "Product 4" },
  { id: 5, img: "/path/to/img5.png", name: "Product 5" },
];

function CircleCarts() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        let next = prev + direction;

        if (next >= products.length) {
          setDirection(-1);
          return products.length - 2;
        }

        if (next < 0) {
          setDirection(1);
          return 1;
        }

        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [direction]);

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div>
      <div className="carousel-sectionaaaa">
        <div className="carousel-wrapperaaaa">
          <div
            className="carouselaaaa"
            style={{ transform: `rotateY(-${activeIndex * (360 / products.length)}deg)` }}
          >
            {products.map((product, index) => (
              <div
                className="carousel__faceaaaa"
                style={{
                  transform: `rotateY(${index * (360 / products.length)}deg) translateZ(400px)`
                }}
                key={product.id}
              >
                <div className={`product-cardaaaa ${activeIndex === index ? "active-card" : ""}`}>
                  <div className="card-image-containeraaaa">
                    <img src={product.img} className="card-imageaaaa" alt={product.name} />
                  </div>
                  <div className="card-contentaaaa">
                    <h6 className="product-nameaaaa">{product.name}</h6>
                     <ButtonPage disabled={activeIndex !== index} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="carousel-navaaaa">
            {products.map((_, index) => (
              <div
                key={index}
                className={`nav-dot ${activeIndex === index ? "active" : ""}`}
                onClick={() => handleDotClick(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CircleCarts;