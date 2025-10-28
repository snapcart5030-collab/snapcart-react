import { useAuth } from "./AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { unregisterUserSocket } from "./socket";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import {
  MyOrders_Url,
  OrderStatusById_Url,
} from "./Api_URL_Page"; 
import "./PcProfile.css";
import SaveLocation from "./SaveLocation";

function PcProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [deliveredCount, setDeliveredCount] = useState(0);

  // Redirect to login if user not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login"); // redirect to login page
    }
  }, [user, navigate]);

  const handleLogout = () => {
    if (user) {
      unregisterUserSocket(user.email);
      logout();
    }
  };

  useEffect(() => {
    const fetchDeliveredOrders = async () => {
      if (!cookies.token) return;
      try {
        const res = await axios.get(MyOrders_Url(), {
          headers: { Authorization: `Bearer ${cookies.token}` },
        });

        const deliveredOrders = await Promise.all(
          res.data.map(async (order) => {
            try {
              const statusRes = await axios.get(OrderStatusById_Url(order._id));
              if (statusRes.data.status === "delivered") return order;
              return null;
            } catch {
              return null;
            }
          })
        );

        setDeliveredCount(deliveredOrders.filter(Boolean).length);
      } catch (err) {
        console.error("❌ Error fetching delivered orders:", err);
      }
    };
    fetchDeliveredOrders();
  }, [cookies]);

  if (!user) return null; // wait for redirect

  return (
    <div className="my_pc_profile_12_main_wrapper">
      <div className="my_pc_profile_12_card">
        <div className="my_pc_profile_12_avatar">
          <img
            src={`https://ui-avatars.com/api/?name=${user.username}&background=6a11cb&color=fff`}
            alt="Profile"
          />
        </div>

        <h2 className="my_pc_profile_12_title">{user.username}</h2>

        <div className="my_pc_profile_12_info">
          <p><strong>📧 Email:</strong> {user.email}</p>
          <p><strong>📱 Mobile:</strong> {user.mobile || "N/A"}</p>
        </div>

        <div className="my_pc_profile_12_buttons">
          <button onClick={handleLogout} className="my_pc_profile_12_btn btn btn-danger logout">🚪 Logout</button>
          <Link to="/" className="my_pc_profile_12_btn home">🏠 Home</Link>
        </div>
      </div>

      <div className="my_pc_profile_12_summary">
        <h2 className="my_pc_profile_12_summary_title">📦 Order Summary</h2>
        <div className="my_pc_profile_12_summary_box">
          <div className="my_pc_profile_12_summary_icon">✅</div>
          <div className="my_pc_profile_12_summary_text">
            <h3>{deliveredCount}</h3>
            <p>Delivered Orders</p>
          </div>
        </div>

        <Link to="/previousorders" className="my_pc_profile_12_summary_link">
          🔍 View All Delivered Orders
        </Link>
      </div>

      <SaveLocation/>
    </div>
  );
}

export default PcProfile;
