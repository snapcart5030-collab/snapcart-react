import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import "./LoginPage.css";
import { Login_Url } from "./Api_URL_Page";
import { registerUserSocket } from "./socket";
import toast from "react-hot-toast";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Get location (lat/lon + address via OpenStreetMap)
  const getLocation = () =>
    new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ latitude: null, longitude: null, address: null });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const latitude = pos.coords.latitude;
          const longitude = pos.coords.longitude;

          let address = null;
          try {
            const resp = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await resp.json();
            address = data.display_name || null;
          } catch (error) {
            console.warn("Reverse geocoding failed:", error);
          }

          resolve({ latitude, longitude, address });
        },
        (err) => {
          console.warn("Geolocation denied or failed:", err);
          resolve({ latitude: null, longitude: null, address: null });
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let location = { latitude: null, longitude: null, address: null };

      // ✅ Ask user for location via toast instead of window.confirm
      const allowLocation = await new Promise((resolve) => {
        toast((t) => (
          <div className="">
            <span>Allow location access to improve your experience?</span>
            <div className="d-flex justify-content-around ">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(true);
                }}
                className="btn btn-sm btn-primary"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(false);
                }}
                className="btn btn-sm btn-secondary"
              >
                No
              </button>
            </div>
          </div>
        ));
      });

      if (allowLocation) {
        location = await getLocation();
      } else {
        toast("You skipped location access.", { duration: 1500 });
      }

      const payload = {
        email: formData.email,
        password: formData.password,
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
      };


      const res = await axios.post(Login_Url(), payload);
      const { token, user: userData } = res.data;

      login(userData, token);
      registerUserSocket(userData.email);

      toast.success("✅ Login successful!", { duration: 1000, position: "top-center" });

      setTimeout(() => navigate("/"), 500);
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.msg || "❌ Login failed. Try again.", { duration: 2500 });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login_container_7">


      <div className="login_card_7">
        <div className="d-flex justify-content-between">
          <Link to={'/'} className="bi fs-2 bi-arrow-left"></Link>
          <h2 className="login_title_7 bi bi-person-circle">   Login</h2>
          <div>

          </div>
        </div>

        <form onSubmit={handleSubmit} className="login_form_7">
          <div className="login_input_group_7">
            <label className="login_label_7">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              className="login_input_7"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login_input_group_7">
            <label className="login_label_7">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="login_input_7"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button id="user_login_button_7" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login (auto location)"}
          </button>
        </form>
        <div className="link_register_go">
          <Link to={"/register"}>Register</Link>
          <div className="Link_home_go">

            <Link to={'/'}>Home</Link>
          </div>
        </div>
          <hr />
        <div className="login_info_box_7">
          <span> Use your registered email and password to log in.</span>
          <div > Don’t have an account ? <Link className="text-dark" to="/register">Register here</Link>.</div>
        </div>


      </div>
    </div>
  );
}

export default LoginPage;
