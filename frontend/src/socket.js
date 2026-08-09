// frontend/src/socket.js
// Centralized Socket.io client connection for real-time messaging & order tracking.

import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "/");

export const socket = io(SOCKET_URL, {
  autoConnect: false, // Don't connect until user is authenticated
  transports: ["websocket", "polling"],
  withCredentials: true,
});

export const connectSocket = () => {
  if (!socket.connected) socket.connect();
};

export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};

export default socket;
