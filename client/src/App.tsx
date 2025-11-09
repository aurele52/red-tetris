import { useEffect, useState } from "react";
import { socket } from "./socket";
import { useKeyboard } from "./ui/hooks/useKeyboard";
import { fromKey } from "./app/actions";
import HUD from "./ui/components/HUD";
import BoardView from "./ui/components/Board";
import { addPieceBoard } from "./selector";
import type { GameState } from "./types/GameState.type";
// import React, { useEffect, useRef, useState } from "react";
// import Api from "./Api";

export default function App() {
  const [gameState, setGameState] = useState<GameState>();

  const [room, setRoom] = useState("demo");
  const [connected, setConnected] = useState(false);

  //
  useKeyboard((key) => {
    const act = fromKey(key);
    if (act) socket.emit("game/action", act);
  });

  // Sélecteur pur pour composer board gelé + pièce active

  useEffect(() => {
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("game/state", (st) => {
      console.log(st);
      setGameState(st);
    });
    return () => {
      socket.off();
    };
  }, []);

  const join = () => {
    if (!socket.connected) socket.connect();
    socket.emit("join_room", { roomId: room });
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20 }}>
      <div style={{ padding: 20 }}>
        <p>Statut: {connected ? "connecté" : "déconnecté"}</p>
        {!connected && (
          <>
            <input value={room} onChange={(e) => setRoom(e.target.value)} />
            <button onClick={join}>Join</button>
          </>
        )}
      </div>
      {gameState && (
        <div style={{ display: "grid", gap: 12 }}>
          <HUD />
          <BoardView
            board={addPieceBoard(gameState.board, gameState.activePiece)}
          />
        </div>
      )}
      {/*<Api />*/}
    </div>
  );
}
