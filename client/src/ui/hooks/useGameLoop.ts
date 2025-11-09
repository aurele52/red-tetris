import { useEffect, useRef } from "react";

/**
 * Loop simple basé sur setInterval.
 * @param tick      callback appelé à chaque tick
 * @param interval  période en ms (ex: 500)
 * @param running   true pour démarrer/stopper la boucle
 */
export function useGameLoop(tick: () => void, interval = 500, running = true) {
  const tickRef = useRef(tick);
  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  useEffect(() => {
    if (!running || interval <= 0) return;
    const id = setInterval(() => tickRef.current(), interval);
    return () => clearInterval(id);
  }, [running, interval]);
}
