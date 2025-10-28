import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./RegisterPage.css";

// ✅ Replace with your actual API URL
import { Register_Url } from "./Api_URL_Page";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    mobile: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Direct Register
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(Register_Url(), formData);
      toast.success(res.data.msg || "Registration successful!");

      setFormData({
        username: "",
        mobile: "",
        email: "",
        password: "",
      });

      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register_container_7">
      <div className="register_card_7">
        <div className="d-flex justify-content-between">
          <Link to={'/'} className="bi fs-2 bi-arrow-left"></Link> <h2 className="register_title_7 bi bi-person-circle">  Register</h2>
           <div>
            
           </div>
        </div>

        <form onSubmit={handleRegister} className="register_form_7">
          <div className="register_input_group_7">
            <label className="register_label_7">Username</label>
            <input
              type="text"
              placeholder="Enter name"
              name="username"
              className="register_input_7"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register_input_group_7">
            <label className="register_label_7">Mobile</label>
            <input
              type="text"
              placeholder="Enter mobile"
              name="mobile"
              className="register_input_7"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register_input_group_7">
            <label className="register_label_7">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              className="register_input_7"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register_input_group_7">
            <label className="register_label_7">Password</label>
            <input
              type="password"
              name="password"
               placeholder="Enter password"
              className="register_input_7"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button id="user_register_button_7" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="go_to_login_page">
          <span>Already have an account? </span>
          <Link to="/login">Login</Link>
        </div>

      </div>
    </div>
  );
}

export default RegisterPage;
