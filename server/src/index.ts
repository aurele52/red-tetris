import http from "http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import { GameRoom } from "./room/rooms";
import { Action } from "./type/Action.type";

const app = express();
app.use(cors());
app.get("/", (_req, res) => res.send("OK"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: ["http://localhost:8081"], methods: ["GET", "POST"] },
});

const rooms = new Map<string, GameRoom>();
function getRoom(id: string) {
  let r = rooms.get(id);
  if (!r) {
    r = new GameRoom(id);
    rooms.set(id, r);
  }
  return r;
}

io.on("connection", (socket) => {
  socket.on("join_room", ({ roomId }) => {
    if (!roomId) return;
    const room = getRoom(roomId);
    const { joined, reason } = room.join(socket.id);
    if (!joined) {
      socket.emit(reason || "room_full", { roomId });
      return;
    }
    console.log("test", room.snapshot());
    socket.join(roomId);
    socket.data.roomId = roomId;
    io.to(roomId).emit("game/state", room.snapshot());
  });

  socket.on("game/action", (action: Action) => {
    const roomId = socket.data.roomId as string | undefined;
    if (!roomId) return;
    const room = getRoom(roomId);
    room.applyAction(action);
    io.to(roomId).emit("game/state", room.snapshot());
  });

  socket.on("disconnect", () => {
    const roomId = socket.data.roomId as string | undefined;
    if (!roomId) return;
    const room = getRoom(roomId);
    room.leave(socket.id);
    io.to(roomId).emit("room_update", room.snapshot());
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});
