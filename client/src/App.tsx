// import React, { useEffect, useRef, useState } from "react";
// import Game from "./ui/components/Game";
// import Api from "./Api";

// export default function App() {
//   return (
//     <div style={{ fontFamily: "sans-serif", padding: 20 }}>
//       {/* <Game /> */}
//       <Api />
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { socket } from "./socket";

export default function App() {
  const [roomId, setRoomId] = useState("demo");
  const [connected, setConnected] = useState(false);
  const [role, setRole] = useState(null);
  const [log, setLog] = useState([]);
  const [ready, setReady] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // écouteurs
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => {
      setConnected(false);
      setReady(false);
      push("Déconnecté");
    });

    socket.on("room_update", (data) => {
      const me = data.players.find((p) => p.id === socket.id);
      setRole(me?.role || null);
      push(`Room update: ${JSON.stringify(data)}`);
    });

    socket.on("room_full", () => {
      push("Room pleine (2 joueurs max).");
    });

    socket.on("ready", () => {
      setReady(true);
      push("Les 2 joueurs sont prêts !");
    });

    socket.on("opponent_move", (payload) => {
      push(`Move reçu de ${payload.from}: ${JSON.stringify(payload)}`);
    });

    socket.on("chat", ({ from, message }) => {
      push(`[${from}] ${message}`);
    });

    socket.on("player_left", ({ role }) => {
      setReady(false);
      push(`Le joueur ${role} est parti.`);
    });

    return () => {
      socket.off();
    };
  }, []);

  function push(text) {
    setLog((l) => [...l, text]);
  }

  const join = () => {
    if (!socket.connected) socket.connect();
    socket.emit("join_room", { roomId });
  };

  const sendMove = () => {
    const next = moveCount + 1;
    setMoveCount(next);
    socket.emit("move", { kind: "CLICK", count: next, ts: Date.now() });
    push(`Move envoyé (#${next})`);
  };

  const sendChat = () => {
    if (!msg.trim()) return;
    socket.emit("chat", { message: msg.trim() });
    setMsg("");
  };

  return (
    <div
      style={{
        fontFamily: "ui-sans-serif",
        padding: 24,
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      <h1>Demo 2 joueurs (Socket.IO)</h1>

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="room id"
          style={{ padding: 8, flex: 1 }}
        />
        <button onClick={join} style={{ padding: "8px 12px" }}>
          Rejoindre
        </button>
      </div>

      <p>
        Statut: {connected ? "connecté" : "déconnecté"}{" "}
        {role ? `— rôle: ${role}` : ""}
      </p>
      <p>
        {ready ? "La partie peut commencer !" : "En attente d’un autre joueur…"}
      </p>

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <button
          onClick={sendMove}
          disabled={!ready}
          style={{ padding: "8px 12px" }}
        >
          Envoyer un move
        </button>
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="message"
          style={{ padding: 8, flex: 1 }}
        />
        <button
          onClick={sendChat}
          disabled={!connected}
          style={{ padding: "8px 12px" }}
        >
          Chat
        </button>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 12,
          height: 240,
          overflow: "auto",
          background: "#fafafa",
        }}
      >
        {log.map((l, i) => (
          <div
            key={i}
            style={{
              fontFamily: "ui-monospace",
              fontSize: 14,
              marginBottom: 6,
            }}
          >
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}
