import { Link } from "react-router-dom";
import "./BatteryError.css";

function BatteryError({message}) {
  return (
    <div className="my_battery_problem_animation_4">
      <div className="battery_wrapper_4">
        <div className="battery_4">
          <div className="battery_level_4"></div>
          <div className="battery_tip_4"></div>20%
        </div>

        <div className="battery_text_4">
          <p className="charging_text_4">
            ⚠️ Your battery is below 20%! Please charge your device before confirming the order.
          </p>
        </div>
      </div>

      {/* Friendly village-style icon/animation */}
      <div className="village_person_animation_4">
        <div className="person_4">
          <div className="head_4"></div>
          <div className="body_4"></div>
        </div>
        <p className="person_text_4">⚡ Please Charge your device!</p>

      </div>
      <Link to={'/'}>Go to Home</Link>
       <div>
        <Link to={'/cart'}>Go to Cart</Link>
       </div>
    </div>
  );
}

export default BatteryError;
