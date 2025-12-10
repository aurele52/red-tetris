export default function BoardView(props) {
  const color = [
    "linear-gradient(135deg, #00FFFF, #00bcd4)",  // I-Piece (cyan to light cyan)
    "linear-gradient(135deg, #FFFF00, #ffeb3b)",  // O-Piece (yellow to golden yellow)
    "linear-gradient(135deg, #FF0000, #e53935)",  // Z-Piece (red to darker red)
    "linear-gradient(135deg, #800080, #9b59b6)",  // T-Piece (purple to lavender)
    "linear-gradient(135deg, #FFA500, #ff5722)",  // L-Piece (orange to dark orange)
    "linear-gradient(135deg, #0000FF, #2196f3)",  // J-Piece (blue to light blue)
    "linear-gradient(135deg, #00FF00, #4caf50)",  // S-Piece (green to darker green)
    "linear-gradient(135deg, #1a1a1a, #0b0b0b)",  // Background (grayish blue)
    "#006"  // Line malus
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
      gap: "2px",
      background: "#111",
      padding: "1px",
      width: "max-content",
      boxShadow: `var(--shadow-offset-small) var(--shadow-offset-small) 0px var(--outline-red),
                  var(--shadow-offset-large) var(--shadow-offset-large) 0px var(--outline-blue),
                  0 0 12px var(--outline-black)`,
      border: "2px solid #ffd500", 
    }}
    >
      {printBoard(props.board)}
    </div>
  );
}
