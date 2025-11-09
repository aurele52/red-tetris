import { io } from "socket.io-client";

// En dev : backend sur 3000
export const socket = io("http://localhost:4000", {
  autoConnect: false, // on connecte quand on a la room
  transports: ["websocket"], // plus direct
});
