import { io } from "socket.io-client";
let socketInstance = null;

export const getSocketConnection = () => {
  // This prevents multiple connection spamming.
  if (socketInstance) {
    return socketInstance;
  }

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Create the single instance
  socketInstance = io(backendUrl, {
    withCredentials: true,
    autoConnect: true,
  });

  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};