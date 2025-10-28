import { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";
import {Loaction_User_Identify} from './Api_URL_Page'

function SaveLocation() {
  const [cookies] = useCookies(["token"]);
  const [location, setLocation] = useState(
    JSON.parse(localStorage.getItem("userLocation")) || null
  );

  const saveUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported!");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // 🌍 Reverse geocoding using OpenStreetMap
          const geoRes = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );

          const address =
            geoRes.data?.display_name ||
            `Lat: ${latitude}, Lng: ${longitude}`;

          // ✅ Save location to backend
          await axios.post(
            `${Loaction_User_Identify()}/auth/location`,
            { latitude, longitude, address },
            { headers: { Authorization: `Bearer ${cookies.token}` } }
          );

          // ✅ Save location locally (UI + localStorage)
          const userLocation = { latitude, longitude, address };
          setLocation(userLocation);
          localStorage.setItem("userLocation", JSON.stringify(userLocation));

          toast.success(`📍 Location saved: ${address}`);
        } catch (error) {
          console.error("Location save error:", error);
          toast.error("Failed to fetch or save location");
        }
      },
      () => toast.error("❌ Turn On Your Location access ")
    );
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <button onClick={saveUserLocation} className="btn btn-primary">
        Save My Location
      </button>

      {/* ✅ Display saved location */}
      {location && (
        <div style={{ marginTop: "15px" }}>
          <h5>📍 Your Saved Location:</h5>
          <p>
            <strong>Address:</strong> {location.address}
            <br />
            <strong>Latitude:</strong> {location.latitude}
            <br />
            <strong>Longitude:</strong> {location.longitude}
          </p>
        </div>
      )}
    </div>
  );
}

export default SaveLocation;
