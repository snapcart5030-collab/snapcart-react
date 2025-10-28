import { io } from "socket.io-client";

export const socket = io("https://snapcart-usja.onrender.com", {
  transports: ["websocket", "polling"],
});

// ✅ Register user after login
export const registerUserSocket = (userEmail) => {
  if (userEmail) {
    socket.emit("register", userEmail);
    console.log("🟢 Registered socket for:", userEmail);
  }
};

// ✅ Unregister user on logout
export const unregisterUserSocket = (userEmail) => {
  if (userEmail) {
    socket.emit("unregister", userEmail);
    console.log("🔴 Unregistered socket for:", userEmail);
  }
};
