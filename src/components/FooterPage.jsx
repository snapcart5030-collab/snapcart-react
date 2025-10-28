import { Link, useNavigate } from "react-router-dom";
import "./FooterPage.css";
import { useAuth } from "./AuthProvider";
import { toast } from "react-hot-toast";

function FooterPage() {
const navigate = useNavigate();
 const { user } = useAuth();

  function contactPageCome(e) {
    const inputValue = e.target.value.trim(); 
    if (!user) {
       toast.error("Please login first!");
      return;
    }
    if (inputValue.length > 0) {
      navigate("/contactpage");
       inputValue=''
    }
    
  }

  return (
    <footer className="my_footer_wrapper_6">
      {/* ======= Desktop Footer ======= */}
          
      <div className="my_footer_pc_6">
        <div className="my_footer_section_6">
          <h4 className="my_footer_title_6">Company</h4>
          <ul className="my_footer_list_6">
            <li><Link to="/" className="my_footer_bar_text_6">Home</Link></li>
            <li><Link to="/about" className="my_footer_bar_text_6">About</Link></li>
            <li><Link to="/service" className="my_footer_bar_text_6">Services</Link></li>
            <li><Link to="/contactpage" className="my_footer_bar_text_6">Contact</Link></li>
          </ul>
        </div>

        <div className="my_footer_section_6">
          <h4 className="my_footer_title_6">Explore</h4>
          <ul className="my_footer_list_6">
            <li><Link to="/categorypc" className="my_footer_bar_text_6">All Categories</Link></li>
            <li><Link to="/offers" className="my_footer_bar_text_6">Offers</Link></li>
            <li><Link  className="my_footer_bar_text_6">New Arrivals</Link></li>
          </ul>
        </div>

        <div className="my_footer_section_6">
          <h4 className="my_footer_title_6">Support</h4>
          <ul className="my_footer_list_6">
            <li><Link to={'/contactpage'}  className="my_footer_bar_text_6">Help Center</Link></li>
            <li><Link  className="my_footer_bar_text_6">Privacy Policy</Link></li>
          </ul>
        </div>

        <div className="my_footer_section_6">
          <h4 className="my_footer_title_6">Connect</h4>
          <p className="my_footer_contact_6">Email: snapcart.com</p>
          <p className="my_footer_contact_6">Phone: +91 9876543210</p>
          <div className="my_footer_social_icons_6">
            <i className="bi bi-facebook my_footer_icon_6"></i>
            <i className="bi bi-instagram my_footer_icon_6"></i>
            <i className="bi bi-twitter my_footer_icon_6"></i>
          </div>
        </div>
      </div>

      {/* ======= Mobile Footer Layout ======= */}
      <div className="my_footer_mobile_6">
             <div className="input-group mb-3">
              <input onChange={contactPageCome} placeholder="Enter message for us  ..." className="form-control" type="text" /><button className="bi bi-search btn btn-success"></button>
             </div>
             <hr />
        <div className="my_footer_mobile_row_6">
          <div className="my_footer_mobile_col_6">
            <h5 className="my_footer_title_mobile_6">Company</h5>
            <ul className="my_footer_list_6">
              <li><Link to="/" className="my_footer_bar_text_6">Home</Link></li>
              <li><Link to="/about" className="my_footer_bar_text_6">About</Link></li>
              <li><Link to="/service" className="my_footer_bar_text_6">Services</Link></li>
              <li><Link to="/contactpage" className="my_footer_bar_text_6">Contact</Link></li>
            </ul>
          </div>

          <div className="my_footer_mobile_col_6">
            <h5 className="my_footer_title_mobile_6">Explore</h5>
            <ul className="my_footer_list_6">
              <li><Link to="/categorypc" className="my_footer_bar_text_6">All Categories</Link></li>
              <li><Link  className="my_footer_bar_text_6">Offers</Link></li>
              <li><Link  className="my_footer_bar_text_6">New Arrivals</Link></li>
            </ul>
          </div>
        </div>

        {/* Row 2: Connect & Support */}
        <div className="my_footer_mobile_row_6">
          <div className="my_footer_mobile_col_6">
            <h5 className="my_footer_title_mobile_6">Connect</h5>
            <p className="my_footer_contact_6">Email: snapcart.com</p>
            <p className="my_footer_contact_6">Phone: +91 9876543210</p>
            <div className="my_footer_social_icons_6">
              <i className="bi bi-facebook my_footer_icon_6"></i>
              <i className="bi bi-instagram my_footer_icon_6"></i>
              <i className="bi bi-twitter my_footer_icon_6"></i>
            </div>
          </div>

          <div className="my_footer_mobile_col_6">
            <h5 className="my_footer_title_mobile_6">Support</h5>
            <ul className="my_footer_list_6">
              <li><Link to="/contactpage" className="my_footer_bar_text_6">Help Center</Link></li>
              <li><Link to="/privacy" className="my_footer_bar_text_6">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="my_footer_bottom_6">
          <p className="my_footer_copy_6">© 2025 Snapcart. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default FooterPage;
