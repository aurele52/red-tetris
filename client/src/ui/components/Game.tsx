import React, { useMemo, useReducer } from "react";
import { reducer } from "../../app/reducer";
import { initialState } from "../../app/state";
import { A } from "../../app/actions";
import { visibleBoard } from "../../app/selectors";

import Board from "./Board";
import { useKeyboard } from "../hooks/useKeyboard";
import { useGameLoop } from "../hooks/useGameLoop";

import { DefaultSize } from "../../domain/config";
import HUD from "./HUD";

export default function Game() {
  // État initial déterministe côté UI (le noyau reste pur)
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    initialState(Date.now(), DefaultSize),
  );

  // Clavier -> Action (mapping pur centralisé dans app/actions)
  useKeyboard((key) => {
    const act = typeof A.fromKey === "function" ? A.fromKey(key) : null;
    if (act) dispatch(act);
  });

  // Boucle de jeu -> Tick (intervalle minimal pour un prototype)
  useGameLoop(() => {
    dispatch(A.tick());
  }, 500); // ms

  // Sélecteur pur pour composer board gelé + pièce active
  const boardForView = useMemo(
    () =>
      typeof visibleBoard === "function" ? visibleBoard(state) : state.board,
    [state],
  );

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <HUD />
      <Board board={boardForView} />
    </div>
  );
}
