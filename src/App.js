import { Route, Routes } from "react-router-dom";
import { Suspense, useState, useEffect, lazy } from "react";
import "./App.css";
import LaptopNavbar from "./components/LaptopNavbar";
import MobileNavbar from "./components/MobileNavbar";
import BottomNavbar from "./components/BottomNavbar";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./components/AuthProvider";
import { CartProvider } from "./components/CartProvider";
import { Toaster } from "react-hot-toast";
import {
  AllCategoriesApi_URL,
  Cart_Url,
} from "./components/Api_URL_Page"; 
import PageLoader from "./components/PageLoader";
import BatteryError from "./components/BatteryError";
import RefreshLoader from "./components/RefreshLoader";
import AboutPage from "./components/AboutPage";
import ServicePage from "./components/ServicePage";
import Admin from "./components/Admin";
import OffersPage from "./components/OffersPage";

const SearchPage = lazy(() => import("./components/SearchPage"));
const LoginPage = lazy(() => import("./components/LoginPage"));
const CategoryPC = lazy(() => import("./components/CategoryPC"));
const HomePage = lazy(() => import("./components/HomePage"));
const PcProfile = lazy(() => import("./components/PcProfile"));
const CartPage = lazy(() => import("./components/CartPage"));
const ContactPage = lazy(() => import("./components/ContactPage"));
const RegisterPage = lazy(() => import("./components/RegisterPage"));
const CategoryPage = lazy(() => import("./components/CategoryPage"));
const MyOrders = lazy(() => import("./components/MyOrders"));
const PreviousOrders = lazy(() => import("./components/PreviousOrders"));
const CategoryProductPage = lazy(() =>
  import("./components/CategoryProductPage")
);

function App() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catRes, cartRes] = await Promise.all([
          fetch(AllCategoriesApi_URL()),
          fetch(Cart_Url()),
        ]);

        if (!catRes.ok || !cartRes.ok) {
          throw new Error("Failed to load initial data");
        }

        const [catData, cartData] = await Promise.all([
          catRes.json(),
          cartRes.json(),
        ]);

        setCategories(catData);
        setCart(cartData);
      } catch (err) {
        console.error("❌ Error while loading initial data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);
  if (loading) {
    return (
      <div>
        <RefreshLoader/>
      </div>
    );
  }

  return (
    <AuthProvider>
      <CartProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <div id="user_unsecrcoll_laptop">
          <LaptopNavbar />
        </div>

        <div className="its-margin-gap-only-for-laptops-or-pc"></div>

        <div className="this_show_only_for_mobile">
          <div>
            <MobileNavbar />
          </div>
          
           <div className="mt-5">
            <CategoryPage categories={categories} />
           </div>
        </div>

        <ScrollToTop />

          <Routes>
            <Route path="/" element={<HomePage categories={categories} />} />
            <Route path="/about" element={<AboutPage/>}/>
            <Route path="/offers" element={<OffersPage/>}/>
            <Route path="/service" element={<ServicePage/>}/>
            <Route path="/admin" element={<Admin/>}/>
            <Route path="/cart" element={<CartPage cart={cart} />} />
            <Route path="/contactpage" element={<ContactPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/batery" element={<BatteryError />} />
            <Route path="/profilepc" element={<PcProfile />} />
            <Route path="/categorypc" element={<CategoryPC />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/myorders" element={<MyOrders />} />
            <Route path="/previousorders" element={<PreviousOrders />} />
            <Route
              path="/fruits"
              element={<CategoryProductPage category="fruits" />}
            />
            <Route
              path="/Kitchen"
              element={<CategoryProductPage category="Kitchen" />}
            />
            <Route
              path="/vegetables"
              element={<CategoryProductPage category="vegetables" />}
            />
            <Route
              path="/Women's"
              element={<CategoryProductPage category="Women's" />}
            />
            <Route
              path="/Men's"
              element={<CategoryProductPage category="Men's" />}
            />
            <Route
              path="/beauty"
              element={<CategoryProductPage category="beauty" />}
            />
            <Route
              path="/bakery"
              element={<CategoryProductPage category="bakery" />}
            />
            <Route
              path="/Breakfast"
              element={<CategoryProductPage category="Breakfast" />}
            />

             <Route
              path="/lunch"
              element={<CategoryProductPage category="lunch" />}
            />
             <Route
              path="/Jewellery"
              element={<CategoryProductPage category="Jewellery" />}
            />
             <Route
              path="/Silver"
              element={<CategoryProductPage category="Silver" />}
            />
             <Route
              path="/dinner"
              element={<CategoryProductPage category="dinner" />}
            />
            <Route
              path="/toys"
              element={<CategoryProductPage category="toys" />}
            />
            <Route
              path="/Homes"
              element={<CategoryProductPage category="Homes" />}
            />
          </Routes>
       

        
        <BottomNavbar />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
