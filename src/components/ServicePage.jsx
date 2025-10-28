import "./ServicePage.css";

function ServicePage() {
  return (
    <div id="my_service_container_10">
      <h1 id="my_service_title_16">
        <i className="bi bi-gear-wide-connected"></i> Our Services
      </h1>

      <div id="my_service_grid_12">
        {/* Service 1 */}
        <div id="my_service_card_21">
          <img
            id="my_service_img_31"
            src="https://cdn-icons-png.flaticon.com/512/1055/1055646.png"
            alt="Web Development"
          />
          <h3 id="my_service_name_41">
            <i style={{color:"#8e2de2"}}  className="bi bi-code-slash"></i>  Web Development
          </h3>
          <p id="my_service_text_51">
            We build fast, responsive and modern websites with React, Node, and MongoDB.
          </p>
        </div>

        {/* Service 2 */}
        <div id="my_service_card_22">
          <img
            id="my_service_img_32"
            src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
            alt="Mobile App"
          />
          <h3 id="my_service_name_42">
            <i style={{color:"#8e2de2"}}  className="bi bi-phone"></i>  Mobile App Design
          </h3>
          <p id="my_service_text_52">
            Stunning mobile experiences optimized for both Android and iOS.
          </p>
        </div>

        {/* Service 3 */}
        <div id="my_service_card_23">
          <img
            id="my_service_img_33"
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Digital Marketing"
          />
          <h3 id="my_service_name_43">
            <i style={{color:"#8e2de2"}}  className="bi bi-bullseye"></i>  Digital Marketing
          </h3>
          <p id="my_service_text_53">
            Grow your business online with SEO, social media, and paid ads.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ServicePage;
