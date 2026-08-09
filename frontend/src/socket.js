// frontend/src/socket.js
// Centralized Socket.io client connection for real-time two-way chat messaging.

import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "/");

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  auth: (callback) => {
    callback({ token: localStorage.getItem("food_garden_token") || undefined });
  },
  transports: ["websocket", "polling"],
  withCredentials: true,
});

export default socket;
