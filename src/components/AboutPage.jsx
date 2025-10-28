
import "./AboutPage.css";
import { Link } from "react-router-dom";

function AboutPage() {
  return (
    <div id="my_about_container_10">
      {/* Title */}
      <h1 id="my_about_title_11">
        <i className="bi bi-person-badge"></i> About Us
      </h1>

      {/* Content Section */}
      <div id="my_about_section_12">
        {/* Image */}
        <div id="my_about_imgbox_13">
          <img
            id="my_about_img_14"
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="About us illustration"
          />
        </div>

        {/* Text */}
        <div id="my_about_textbox_15">
          <h2 id="my_about_subtitle_16">
            <i  style={{color:"#8e2de2"}} className="bi bi-lightbulb-fill"></i>  Who We Are
          </h2>
          <p id="my_about_text_17">
            We are a passionate team of developers and designers dedicated to
            crafting modern, responsive, and user-friendly digital experiences.
            Our mission is to blend creativity with technology to deliver
            impactful solutions for businesses and individuals.
          </p>

          <h2 id="my_about_subtitle_18">
            <i style={{color:"#8e2de2"}} className="bi bi-grid-fill"></i>  Our Mission
          </h2>
          <p id="my_about_text_19">
            To empower clients through innovative technology, helping them grow
            and adapt to the ever-changing digital landscape with confidence and
            success.
          </p>

          <button id="my_about_btn_20">
           <Link to={'/contactpage'} className="text-light"> <i className="bi bi-chat-dots"></i> Contact Us</Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
