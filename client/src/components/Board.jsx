export default function BoardView(props) {
  const color = [
    "lightblue",
    "blue",
    "orange",
    "yellow",
    "green",
    "purple",
    "red",
    "#699",
    "#006",
  ];

  const printBoard = (board) => {
    return board.map((h, i) =>
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
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${10}, 28px)`,
        gridTemplateRows: `repeat(${20}, 28px)`,
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
