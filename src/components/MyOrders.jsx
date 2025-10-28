import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import io from "socket.io-client";
import { useAuth } from "./AuthProvider";
import {
  MyOrders_Url,
  OrderStatusById_Url,
  CancelOrder_Url,
  ConfirmOrder_Url,
} from "./Api_URL_Page";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeliveryAnimation from "./DeliveryAnimation.jsx";
import { useLocation } from "react-router-dom";

const socket = io("http://localhost:5030", {
  transports: ["websocket", "polling"],
});

function MyOrders() {
  const { user } = useAuth();
  const [cookies] = useCookies(["token"]);
  const [orders, setOrders] = useState([]);
  const location = useLocation();

  // ✅ Fetch orders
  const fetchOrders = async () => {
    if (!cookies.token) return;
    try {
      const res = await axios.get(MyOrders_Url(), {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });

      const fetched = res.data;
      const updated = await Promise.all(
        fetched.map(async (order) => {
          try {
            const statusRes = await axios.get(OrderStatusById_Url(order._id));
            return { ...order, status: statusRes.data.status };
          } catch {
            return { ...order, status: "pending" };
          }
        })
      );

      setOrders(updated);
    } catch (err) {
      console.error("Fetch orders error:", err);
      toast.error("Failed to load orders.");
    }
  };

  useEffect(() => {
    if (cookies.token) fetchOrders();
  }, [cookies.token]);

  useEffect(() => {
    if (location.state?.refresh) fetchOrders();
  }, [location.state]);

  // ✅ Refresh every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      if (cookies.token) fetchOrders();
    }, 10000);
    return () => clearInterval(interval);
  }, [cookies]);

  // ✅ Socket updates
  useEffect(() => {
    socket.on("orderUpdate", (data) => {
      setOrders((prev) =>
        prev.map((o) =>
          o._id === data.orderId ? { ...o, status: data.status } : o
        )
      );
    });

    socket.on("newOrder", (newOrder) => {
      setOrders((prev) => [newOrder, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  // ✅ Cancel order
  const cancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      await axios.post(
        CancelOrder_Url(),
        { orderId },
        { headers: { Authorization: `Bearer ${cookies.token}` } }
      );
      toast.info("❌ Order canceled!");
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "canceled" } : o
        )
      );
    } catch {
      toast.error("Failed to cancel order.");
    }
  };

  // ✅ Resume order
  const resumeOrder = async (orderId) => {
    try {
      await axios.post(ConfirmOrder_Url(), { orderId });
      toast.success("✅ Order resumed!");
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "pending" } : o
        )
      );
    } catch {
      toast.error("Failed to resume order.");
    }
  };

  // ✅ Format date
  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  // ✅ Filter by status
  const currentOrders = orders.filter(
    (o) => o.status === "on-the-way" || o.status === "pending"
  );
  const completedOrders = orders.filter((o) => o.status === "delivered");
  const canceledOrders = orders.filter((o) => o.status === "canceled");

  return (
    <div className="container mt-5" style={{ textAlign: "center" }}>
      <ToastContainer position="top-center" />
      <h2>📦 My Orders</h2>

      {!user ? (
        <p style={{ color: "red" }}>Please log in to view your orders.</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <>
          {/* 🟢 Current Orders */}
          {currentOrders.length > 0 && (
            <div
              style={{
                background: "#e8f5e9",
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "25px",
              }}
            >
              <h4 style={{ color: "#2e7d32", textAlign: "left" }}>
                🟢 Current Orders
              </h4>

              {currentOrders.map((order) => {
                const { date, time } = formatDateTime(order.createdAt);
                return (
                  <div
                    key={order._id}
                    style={{
                      border: "1px solid #c8e6c9",
                      borderRadius: "8px",
                      marginTop: "15px",
                      padding: "10px",
                      background: "#fff",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h6>🧾 <strong>Order ID:</strong> {order._id}</h6>
                      <span>📅 {date} | 🕒 {time}</span>
                    </div>

                    <table className="table table-bordered mt-2">
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Qty</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(order.products || []).map((item, i) => (
                          <tr key={i}>
                            <td>
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  borderRadius: "8px",
                                  objectFit: "cover",
                                }}
                              />
                            </td>
                            <td>{item.productName}</td>
                            <td>₹{item.price}</td>
                            <td>{item.quantity}</td>
                            <td>₹{item.price * item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <p><strong>Total: ₹{order.totalAmount}</strong></p>
                    <p>{order.status === "pending" ? "⌛ Pending" : "🚴 On the way"}</p>
                    {order.status === "pending" && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => cancelOrder(order._id)}
                      >
                        Cancel
                      </button>
                    )}
                       <DeliveryAnimation orderId={order._id} />
                  </div>
                );
              })}
            </div>
          )}

          {/* ✅ Delivered Orders */}
          {completedOrders.length > 0 && (
            <div
              style={{
                background: "#f1f8e9",
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "25px",
              }}
            >
              <h4 style={{ color: "#558b2f", textAlign: "left" }}>
                ✅ Delivered Orders
              </h4>

              {completedOrders.map((order) => {
                const { date, time } = formatDateTime(order.createdAt);
                return (
                  <div
                    key={order._id}
                    style={{
                      border: "1px solid #dcedc8",
                      borderRadius: "8px",
                      marginTop: "15px",
                      padding: "10px",
                      background: "#fff",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h6>🧾 <strong>Order ID:</strong> {order._id}</h6>
                      <span>📅 {date} | 🕒 {time}</span>
                    </div>

                    <table className="table table-bordered mt-2">
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Qty</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(order.products || []).map((item, i) => (
                          <tr key={i}>
                            <td>
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  borderRadius: "8px",
                                  objectFit: "cover",
                                }}
                              />
                            </td>
                            <td>{item.productName}</td>
                            <td>₹{item.price}</td>
                            <td>{item.quantity}</td>
                            <td>₹{item.price * item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <p style={{ color: "green", fontWeight: "bold" }}>
                      ✅ Delivered Successfully
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* ❌ Canceled */}
          {canceledOrders.length > 0 && (
            <div
              style={{
                background: "#ffebee",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <h4 style={{ color: "#c62828", textAlign: "left" }}>
                ❌ Canceled Orders
              </h4>
                 
              {canceledOrders.map((order) => (
                <div
                  key={order._id}
                  style={{
                    border: "1px solid #ffcdd2",
                    borderRadius: "8px",
                    marginTop: "15px",
                    padding: "10px",
                    background: "#fff",
                  }}
                >
                  <h6>🧾 Order ID: {order._id}</h6>
                  <p style={{ color: "#d32f2f" }}>❌ This order was canceled</p>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => resumeOrder(order._id)}
                  >
                    Resume Order
                  </button>
                  
                </div>
                
              ))}

           
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MyOrders;
