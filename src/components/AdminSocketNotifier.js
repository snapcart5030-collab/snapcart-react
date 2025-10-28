// src/AdminSocketNotifier.js
import { useEffect } from "react";
import { socket } from "./socket";

export default function AdminSocketNotifier() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 Admin connected:", socket.id);
    });
    socket.on("disconnect", () => {
      console.log("🔴 Admin disconnected");
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return null;
}
