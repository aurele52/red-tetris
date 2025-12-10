export default function Menu({ gameId }) {
  const [mode, setMode] = useState(0);

  const handleStart = () => {
    if (socket) {
      socket.emit("startGame", { gameId, mode });
    }
  };

  const handleRestart = () => {
    if (socket) {
      socket.emit("restartGame", { gameId });
    }
  };

  const handleMode = () => {
    setMode((mode + 1) % 2);
  };

  return (
    <div>
      <p>
        Game ID: <strong>{gameId}</strong>
      </p>
      {isHost && (
        <div>
          <button onClick={handleStart} disabled={gameState?.isStarted}>
            Start Game
          </button>
          <button onClick={handleMode}>Choose Mode : {mode}</button>
          <button onClick={handleRestart}>Restart Game</button>
        </div>
      )}
      {!isHost && <p>Waiting for host to start...</p>}
    </div>
  );
}
