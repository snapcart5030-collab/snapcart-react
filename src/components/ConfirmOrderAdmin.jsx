import React, { useState, useEffect } from "react";
import axios from "axios";
import { socket } from "./socket";
import toast, { Toaster } from "react-hot-toast";
import { OrderStatus_Url } from "./Api_URL_Page";
import "./ConfirmOrderAdmin.css"; 

function ConfirmOrderAdmin() {
  const [orders, setOrders] = useState([]);
  const [otpMap, setOtpMap] = useState({});
  const [loading, setLoading] = useState(false);

  const API_BASE = OrderStatus_Url();

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

  const handleAccept = async (orderId) => {
    try {
      const res = await axios.post(`${API_BASE}/accept`, { orderId });
      socket.emit("startDelivery", { orderId });
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

  const handleSendOtp = async (orderId) => {
    try {
      await axios.post(`${API_BASE}/generate-otp`, { orderId });
      toast("📦 OTP generated (Check server console)", { icon: "📱" });
    } catch (err) {
      console.error("OTP error:", err);
      toast.error("❌ Failed to generate OTP");
    }
  };

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
    <div id="admin_page_container_10">
      <Toaster position="top-center" reverseOrder={false} />
      <h2 id="admin_title_11">
        <i className="bi bi-clipboard-check"></i> Admin — Manage Orders
      </h2>

      {loading && <p id="admin_loading_12">⏳ Loading orders...</p>}
      {!loading && orders.length === 0 && (
        <p id="admin_empty_13">No orders found.</p>
      )}

      {orders.length > 0 && (
        <div id="admin_table_wrapper_14">
          <table id="admin_table_15">
            <thead id="admin_thead_16">
              <tr>
                <th>Order ID</th>
                <th>User Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="admin_tbody_17">
              {orders.map((o) => (
                <tr key={o.orderId}>
                  <td>{o.orderId}</td>
                  <td>{o.userEmail}</td>
                  <td>
                    {o.status === "pending" && (
                      <span id="admin_status_pending_18">
                        <i className="bi bi-hourglass-split"></i> Pending
                      </span>
                    )}
                    {o.status === "on-the-way" && (
                      <span id="admin_status_ontheway_19">
                        <i className="bi bi-truck"></i> On the way
                      </span>
                    )}
                    {o.status === "delivered" && (
                      <span id="admin_status_delivered_20">
                        <i className="bi bi-check-circle"></i> Delivered
                      </span>
                    )}
                  </td>
                  <td id="admin_action_21">
                    {o.status === "pending" && (
                      <button
                        id="admin_btn_accept_22"
                        onClick={() => handleAccept(o.orderId)}
                      >
                        <i className="bi bi-check2-circle"></i> Accept
                      </button>
                    )}

                    {o.status === "on-the-way" && (
                      <>
                        <button
                          id="admin_btn_sendotp_23"
                          onClick={() => handleSendOtp(o.orderId)}
                        >
                          <i className="bi bi-shield-lock"></i> Send OTP
                        </button>

                        <input
                          id="admin_input_otp_24"
                          placeholder="Enter OTP"
                          value={otpMap[o.orderId] || ""}
                          onChange={(e) =>
                            setOtpMap((prev) => ({
                              ...prev,
                              [o.orderId]: e.target.value,
                            }))
                          }
                        />

                        <button
                          id="admin_btn_verify_25"
                          onClick={() => handleVerifyOtp(o.orderId)}
                        >
                          <i className="bi bi-patch-check"></i> Verify
                        </button>
                      </>
                    )}

                    {o.status === "delivered" && (
                      <span id="admin_delivered_text_26">
                        ✅ Delivered Successfully
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ConfirmOrderAdmin;
