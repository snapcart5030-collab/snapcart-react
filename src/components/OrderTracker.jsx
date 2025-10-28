import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useAuth } from "./AuthProvider";
import { useCookies } from "react-cookie";
import {
  MyOrders_Url,
  OrderStatusById_Url,
  CancelOrder_Url,
} from "./Api_URL_Page";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeliveryAnimation from "./DeliveryAnimation.jsx";

const socket = io("https://snapcart-usja.onrender.com", {
  transports: ["websocket", "polling"],
});

function OrderTracker() {
  const { user } = useAuth();
  const [cookies] = useCookies(["token"]);

  const [orderId, setOrderId] = useState(localStorage.getItem("lastOrderId"));
  const [status, setStatus] = useState("Fetching order status...");
  const [showBike, setShowBike] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);

  useEffect(() => {
    if (!user || !cookies.token) {
      setStatus("Please log in to track your order.");
    }
  }, [user, cookies]);

  useEffect(() => {
    const fetchLastOrder = async () => {
      if (!user || !cookies.token) return;

      try {
        const res = await axios.get(MyOrders_Url(), {
          headers: { Authorization: `Bearer ${cookies.token}` },
        });

        if (res.data.length === 0) {
          setStatus("No active orders found.");
          return;
        }

        const latestOrder = res.data[res.data.length - 1];
        setOrderId(latestOrder._id);
        localStorage.setItem("lastOrderId", latestOrder._id);
      } catch (err) {
        console.error("Error fetching latest order:", err);
        setStatus("Failed to load your order.");
      }
    };

    fetchLastOrder();
  }, [user, cookies]);

  useEffect(() => {
    if (!orderId) return;

    axios
      .get(OrderStatusById_Url(orderId))
      .then((res) => {
        const s = res.data.status;
        setStatus(s);
        setShowBike(s === "on-the-way");
        setIsCanceled(s === "canceled");
        setIsDelivered(s === "delivered");
      })
      .catch(() => setStatus("Order not found"));
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;

    socket.on("orderUpdate", (data) => {
      if (data.orderId === orderId) {
        if (data.status === "on-the-way") {
          setStatus("🚴‍♂️ Order is on the way!");
          setShowBike(true);
        } else if (data.status === "canceled") {
          setStatus("❌ Order canceled");
          setShowBike(false);
          setIsCanceled(true);
        } else if (data.status === "delivered") {
          setStatus("✅ Order delivered successfully!");
          setShowBike(false);
          setIsDelivered(true);
        }
      }
    });

    return () => socket.disconnect();
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!orderId) return toast.warn("No order found to cancel.");
    try {
      await axios.post(
        CancelOrder_Url(),
        { orderId },
        { headers: { Authorization: `Bearer ${cookies.token}` } }
      );
      setStatus("❌ Order canceled");
      setShowBike(false);
      setIsCanceled(true);
      toast.info("Order canceled successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel order.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <ToastContainer position="top-center" />
      <h2>📦 Order Tracker</h2>

      {!user ? (
        <p style={{ color: "red" }}>Please log in to track your order.</p>
      ) : (
        <>
          <div
            style={{
              background: "#f9f9f9",
              padding: "10px 20px",
              borderRadius: "10px",
              display: "inline-block",
              marginBottom: "20px",
            }}
          >
            <p>
              <strong>👤 Name:</strong> {user.username || "Unknown"}
            </p>
            <p>
              <strong>📧 Email:</strong> {user.email || "N/A"}
            </p>
          </div>

          <p>
            <strong>🆔 Order ID:</strong> {orderId || "N/A"}
          </p>
          <p>
            <strong>📍 Status:</strong> {status}
          </p>

          {showBike && !isCanceled && !isDelivered && (
            <div
              style={{
                marginTop: "30px",
                fontSize: "30px",
                animation: "moveBike 3s linear infinite",
              }}
            >
              🚴‍♂️ Your order is on the way!
            </div>
          )}

          {!isCanceled && !isDelivered && orderId && (
            <button
              onClick={handleCancelOrder}
              style={{
                marginTop: "20px",
                background: "red",
                color: "#fff",
                padding: "10px 25px",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Cancel Order
            </button>
          )}

          {isDelivered && (
            <p style={{ color: "green", marginTop: 20, fontSize: 18 }}>
              ✅ Order Delivered Successfully!
            </p>
          )}

          {isCanceled && (
            <p style={{ color: "red", marginTop: 20, fontSize: 18 }}>
              ❌ Order has been canceled.
            </p>
          )}
        </>
      )}

      

      <style>{`
        @keyframes moveBike {
          0% { transform: translateX(-150px); }
          100% { transform: translateX(150px); }
        }
      `}</style>
    </div>
  );
}

export default OrderTracker;
