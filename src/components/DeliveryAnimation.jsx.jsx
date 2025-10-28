import { useState, useEffect } from "react";
import axios from "axios";
import { socket } from "./socket";
import "./DeliveryAnimation.css";
import {Delivery_progress_id} from './Api_URL_Page'


function DeliveryAnimation({ orderId }) {
  const [progress, setProgress] = useState(0);
  

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(`${Delivery_progress_id()}/${orderId}`);
        if (res.data?.progress) setProgress(res.data.progress);
      } catch {
        console.warn("⚠️ No saved progress yet");
      }
    };
    fetchProgress();
  }, [orderId]);

  useEffect(() => {
    socket.on("progressUpdate", (data) => {
      if (data.orderId === orderId) {
        setProgress(data.progress);
      }
    });
    return () => socket.off("progressUpdate");
  }, [orderId]);

  const getRiderStyle = () => {
    const style = {
      position: "absolute",
      transition: "all 0.8s ease-in-out",
      transformOrigin: "center center",
    };

    if (progress <= 100) {
      // move down
      style.top = `${progress}px`;
      style.left = "50%";
      style.transform = "translate(-50%, -50%) rotate(-0deg)";
    } else if (progress <= 200) {
      // move left
      style.top = "100px";
      const leftPos = 50 - (progress - 100) * 0.5;
      style.left = `${leftPos}%`;
      style.transform = "translate(-50%, -50%) rotate(180deg)";
    } else if (progress <= 300) {
      // move down again
      style.top = `${100 + (progress - 200)}px`;
      style.left = "25%";
      style.transform = "translate(-50%, -50%) rotate(-360deg)";
    } else if (progress <= 400) {
      // move right
      const leftPos = 25 + (progress - 300) * 0.5;
      style.top = "200px";
      style.left = `${leftPos}%`;
      style.transform = "translate(-50%, -50%) rotate(266deg)";
    } else if (progress <= 500) {
      // move up
      const topPos = 200 - (progress - 400);
      style.top = `${topPos}px`;
      style.left = "75%";
      style.transform = "translate(-50%, -50%) rotate(-180deg)";
    }

    return style;
  };

  return (
    <div className="delivery-screen">
      <h3 className="d-none">🚚 Order Delivery Progress — #{orderId}</h3>

      <img
        width={100}
        src="/image/bik.png"
        alt="Delivery Rider"
        className="delivery-rider"
        style={getRiderStyle()}
      />

      <div className="status-text d-none">
        Progress: <span>{progress}</span>
      </div>
    </div>
  );
}

export default DeliveryAnimation;
