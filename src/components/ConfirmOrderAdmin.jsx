import React, { useState, useEffect } from "react";
import axios from "axios";
import { socket } from "./socket";

import toast, { Toaster } from "react-hot-toast"; // ✅ using react-hot-toast
import { OrderStatus_Url } from "./Api_URL_Page"; // ✅ base URL
import DeliveryAnimation from "./DeliveryAnimation.jsx";

function ConfirmOrderAdmin() {
  const [orders, setOrders] = useState([]);
  const [otpMap, setOtpMap] = useState({});
  const [loading, setLoading] = useState(false);

  const API_BASE = OrderStatus_Url(); // ✅ API base from your helper file

  // ✅ Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/all`);
      setOrders(res.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("❌ Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Accept order
// ✅ After admin accepts order
const handleAccept = async (orderId) => {
  try {
    const res = await axios.post(`${API_BASE}/accept`, { orderId });
    socket.emit("startDelivery", { orderId }); // ✅ send event
    toast.success(res.data?.msg || "✅ Order accepted (Bike on the way)");
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId ? { ...o, status: "on-the-way" } : o
      )
    );
  } catch (err) {
    console.error("Accept failed:", err.response?.data || err.message);
    toast.error(err.response?.data?.msg || "❌ Failed to accept order");
  }
};


  // ✅ Send OTP
  const handleSendOtp = async (orderId) => {
    try {
      await axios.post(`${API_BASE}/generate-otp`, { orderId });
      toast("📦 OTP generated (Check server console)", { icon: "📱" });
    } catch (err) {
      console.error("OTP error:", err);
      toast.error("❌ Failed to generate OTP");
    }
  };

  // ✅ Verify OTP
  const handleVerifyOtp = async (orderId) => {
    const otp = otpMap[orderId];
    if (!otp) return toast.error("⚠️ Please enter OTP first");

    try {
      await axios.post(`${API_BASE}/verify-otp`, { orderId, otp });
      toast.success("✅ Order delivered successfully!");
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, status: "delivered" } : o
        )
      );
    } catch (err) {
      console.error("OTP verify error:", err);
      toast.error(err.response?.data?.msg || "❌ Invalid OTP");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      {/* ✅ Hot Toast container */}
      <Toaster position="top-center" reverseOrder={false} />

      <h2>📋 Admin — Manage Orders</h2>

      {loading && <p>Loading orders...</p>}
      {!loading && orders.length === 0 && <p>No orders found.</p>}

{/* 
      {orders.map((o) => (
  <tr key={o.orderId}>
    <td>{o.orderId}</td>
    <td>{o.userEmail}</td>
    <td>{o.status}</td>
    <td>
      {o.status === "on-the-way" && (
        <DeliveryAnimation orderId={o.orderId} />
      )}
    </td>
  </tr>
))} */}


      {orders.length > 0 && (
        <table
          style={{
            margin: "auto",
            borderCollapse: "collapse",
            width: "85%",
            border: "1px solid #ccc",
            marginTop: 20,
          }}
        >
          <thead>
            <tr style={{ background: "#f3f3f3" }}>
              <th>Order ID</th>
              <th>User Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.orderId}>
                <td>{o.orderId}</td>
                <td>{o.userEmail}</td>
                <td>{o.status}</td>
                <td
                  style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "center",
                    padding: "6px",
                  }}
                >
                  {/* Accept button */}
                  {o.status === "pending" && (
                    <button
                      onClick={() => handleAccept(o.orderId)}
                      style={{
                        background: "green",
                        color: "#fff",
                        padding: "6px 12px",
                        borderRadius: 5,
                        cursor: "pointer",
                      }}
                    >
                      Accept
                    </button>
                  )}

                  {/* OTP Section */}
                  {o.status === "on-the-way" && (
                    <>
                      <button
                        onClick={() => handleSendOtp(o.orderId)}
                        style={{
                          background: "#007bff",
                          color: "#fff",
                          padding: "6px 12px",
                          borderRadius: 5,
                          cursor: "pointer",
                        }}
                      >
                        Send OTP
                      </button>

                      <input
                        placeholder="Enter OTP"
                        value={otpMap[o.orderId] || ""}
                        onChange={(e) =>
                          setOtpMap((prev) => ({
                            ...prev,
                            [o.orderId]: e.target.value,
                          }))
                        }
                        style={{
                          width: 100,
                          padding: "6px",
                          border: "1px solid #ccc",
                          borderRadius: 5,
                        }}
                      />

                      <button
                        onClick={() => handleVerifyOtp(o.orderId)}
                        style={{
                          background: "#333",
                          color: "#fff",
                          padding: "6px 12px",
                          borderRadius: 5,
                          cursor: "pointer",
                        }}
                      >
                        Verify OTP
                      </button>
                    </>
                  )}

                  {/* Delivered */}
                  {o.status === "delivered" && (
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      ✅ Delivered Successfully
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ConfirmOrderAdmin;
