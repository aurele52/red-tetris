// import { useAppDispatch, useAppSelector } from "../store";
// import React from "react";
import { DefaultSize } from "../../domain/config";
// import { addPieceBoard, canStay, emptyBoard } from "../../domain/board";
import type { Board } from "../../domain/types";
// import { movePiece, newPiece } from "../../domain/piece";
// import { rotateShape, shapeTemplate } from "../../domain/shapes";
// import { increment, fetchIncrement } from "../store/slices/counterSlice";

type BoardProps = {
  board: Board;
};

export default function Board(props: BoardProps) {
  // const value = useAppSelector((s) => s.counter.value);
  // const status = useAppSelector((s) => s.counter.status);
  // const dispatch = useAppDispatch();
  // const [activePiece, setActivePiece] = React.useState<Piece>(newPiece(0));
  // const [frozenBoard, setFrozenBoard] = React.useState<Board>(
  //   emptyBoard(DefaultSize),
  // );
  // const change = (act: Piece): Piece => ({
  //   ...act,
  //   kind: ((act.kind + 1) % 7) as Kind,
  //   shape: shapeTemplate[(act.kind + 1) % 7],
  // });
  // const checkMove = (act: Piece, board: Board, x: number, y: number): Piece => {
  //   if (canStay(DefaultSize, board, movePiece(act, x, y)))
  //     return movePiece(act, x, y);
  //   return { ...act };
  // };
  // const keyHandler = (key: string, act: Piece): Piece => {
  //   switch (key) {
  //     case "ArrowLeft":
  //       return checkMove(act, frozenBoard, -1, 0);
  //     case "ArrowRight":
  //       return checkMove(act, frozenBoard, +1, 0);
  //     case "ArrowDown":
  //       return checkMove(act, frozenBoard, 0, +1);
  //     case "ArrowUp":
  //       return checkMove(act, frozenBoard, 0, -1);
  //     case "c":
  //       return change(act);
  //     case "v":
  //       return figeAct(frozenBoard, act);
  //     case " ":
  //       return { ...act, shape: rotateShape(act.shape) }; // barre espace
  //     default:
  //       return act;
  //   }
  // };
  // const figeAct = (board: Board, activePiece: Piece) => {
  //   setFrozenBoard(addPieceBoard(board, activePiece));
  //   return activePiece;
  // };
  // React.useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     setActivePiece((prev) => keyHandler(e.key, prev));
  //   };
  //
  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => window.removeEventListener("keydown", handleKeyDown);
  // }, []);
  const color = [
    "lightblue",
    "blue",
    "orange",
    "yellow",
    "green",
    "purple",
    "red",
    "#699",
  ];

  const printBoard = (board: Board): any[] =>
    board.map((h, i) =>
      h.map((cell, j) => (
        <div
          key={`${i}-${j}`}
          style={{
            width: "28px",
            height: "28px",
            background: color[cell],
            borderRadius: "3px",
          }}
        />
      )),
    );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${DefaultSize.width}, 28px)`,
        gridTemplateRows: `repeat(${DefaultSize.height}, 28px)`,
        gap: "1px",
        background: "#111",
        padding: "1px",
        width: "max-content",
      }}
    >
      {printBoard(props.board)}
    </div>
  );
}
// {/* <h1>Counter: {value}</h1> */}
// {/* <p>Status: {status}</p> */}
// {/* <button onClick={() => dispatch(increment())}>+1</button>{" "} */}
// {/* <button onClick={() => dispatch(fetchIncrement())}>+1 (async)</button> */}
