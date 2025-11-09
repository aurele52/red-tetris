import { useMemo, useState } from "react";
import { socket } from "../../socket";
import { useKeyboard } from "../hooks/useKeyboard";
import { fromKey } from "../../app/actions";
import HUD from "./HUD";
import BoardView from "./Board";

export default function Game() {
  //
  const sendAction = (dir: string) => socket.emit("game/action", dir);
  //     <button onClick={tick}>Tick</button>
  //     <button onClick={() => move("left")}>←</button>
  //     <button onClick={() => move("right")}>→</button>
  //     <button onClick={() => move("cw")}>⟳</button>
  //     <button onClick={() => move("ccw")}>⟳</button>
  //
  // Clavier -> Action (mapping pur centralisé dans app/actions)
  useKeyboard((key) => {
    const act = fromKey(key);
    if (act) sendAction(act);
  });

  // Sélecteur pur pour composer board gelé + pièce active
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <HUD />
      <BoardView board={} />
    </div>
  );
}
