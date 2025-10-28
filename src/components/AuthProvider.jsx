import { createContext, useContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Auth_me_url } from "./Api_URL_Page";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (!cookies.token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get(`${Auth_me_url()}`, {
          headers: { Authorization: `Bearer ${cookies.token}` },
        });
        setUser({ ...data, token: cookies.token });
      } catch (err) {
        console.error("Auth error:", err.response?.data || err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [cookies.token]);

  // Login
  const login = (userData, token) => {
    setCookie("token", token, { path: "/", maxAge: 365 * 24 * 60 * 60 });
    setUser({ ...userData, token });
  };

  // Logout
  const logout = () => {
    removeCookie("token", { path: "/" });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
