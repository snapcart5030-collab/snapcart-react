import { useNavigate } from "react-router-dom";
import "./OffersPage.css";

function OffersPage() {
  const navigate = useNavigate();

  const offers = [
    {
      id: 1,
      title: "Fresh Fruits Offer",
      desc: "Get 30% off on all organic fruits",
      icon: "bi-apple",
      color: "#ffe9e3",
      path: "/fruits",
    },
    {
      id: 2,
      title: "Vegetable Delight",
      desc: "Buy fresh vegetables & get 1kg free",
      icon: "bi-basket3-fill",
      color: "#e2f8e5",
      path: "/vegetables",
    },
    {
      id: 3,
      title: "Home Essentials Sale",
      desc: "Flat 25% off on kitchen & home items",
      icon: "bi-house-door-fill",
      color: "#f7f4e9",
      path: "/homes",
    },
    {
      id: 4,
      title: "Men’s Fashion Deals",
      desc: "Up to 50% off on shirts & jeans",
      icon: "bi-person-fill",
      color: "#e3e9ff",
      path: "/Men's",
    },
    {
      id: 5,
      title: "Women’s Clothing Offer",
      desc: "Buy 2 get 1 free on ethnic wear",
      icon: "bi-bag-heart-fill",
      color: "#ffe4f0",
      path: "/Women's",
    },
    {
      id: 6,
      title: "Jewellery Fest",
      desc: "20% off on gold & silver jewellery",
      icon: "bi-gem",
      color: "#fff5e6",
      path: "/jewellery",
    },
     {
      id: 8,
      title: "Smart Gadget Sale",
      desc: "Up to 40% off on electronics",
      icon: "bi-lightning-fill",
      color: "#eaf3ff",
      path: "/smart",
    },
    {
      id: 7,
      title: "Bakery Bonanza",
      desc: "Buy 1 get 1 on cakes & pastries",
      icon: "bi-cake-fill",
      color: "#fff0e1",
      path: "/bakery",
    },
    {
      id: 9,
      title: "Travel Offers",
      desc: "Flat 15% off on hotel bookings",
      icon: "bi-airplane-fill",
      color: "#e9faff",
      path: "/travel",
    },
    {
      id: 10,
      title: "Baby Care Discounts",
      desc: "Save up to 35% on baby products",
      icon: "bi-balloon-heart-fill",
      color: "#f5f0ff",
      path: "/toys",
    },
  ];

  return (
    <div id="offersContainer">
      <h2 id="offersTitle">
        <i className="bi bi-gift-fill"></i> Today's Exclusive Offers
      </h2>

      <div id="offersGrid">
        {offers.map((offer) => (
          <div
            id="offerCard"
            key={offer.id}
            style={{ backgroundColor: offer.color }}
          >
            <i id="offerIcon" className={`bi ${offer.icon}`}></i>
            <h3 id="offerName">{offer.title}</h3>
            <p id="offerDesc">{offer.desc}</p>
            <button
              id="offerBtn"
              onClick={() => navigate(offer.path)}
            >
              <i className="bi bi-eye-fill"></i> View Offer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OffersPage;
