import { useEffect, useRef } from "react";

type UseKeyboardOptions = {
  target?: Window | Document | HTMLElement | null; // par défaut: window
  preventDefault?: boolean; // empêche le scroll sur les flèches/espace
  capture?: boolean; // phase de capture
  repeat?: boolean; // autoriser les répétitions clavier (key repeat)
  active?: boolean; // activer/désactiver l’écoute
  filter?: (e: KeyboardEvent) => boolean; // ex: ignorer si un input est focus
};

export function useKeyboard(
  onKey: (key: string, e: KeyboardEvent) => void,
  opts: UseKeyboardOptions = {},
) {
  const onKeyRef = useRef(onKey);
  const optsRef = useRef(opts);

  // garder les refs à jour sans rebrancher l'écouteur
  useEffect(() => {
    onKeyRef.current = onKey;
  }, [onKey]);
  useEffect(() => {
    optsRef.current = opts;
  }, [opts]);

  useEffect(() => {
    const {
      target = window,
      preventDefault = true,
      capture = false,
      repeat = false,
      active = true,
      filter,
    } = optsRef.current;

    if (!active || !target) return;

    const handler = (e: KeyboardEvent) => {
      if (!repeat && e.repeat) return;
      if (filter && !filter(e)) return;
      if (preventDefault) {
        // évite le scroll sur ArrowDown/Space, etc.
        e.preventDefault();
      }
      onKeyRef.current(e.key, e);
    };

    target.addEventListener("keydown", handler, { capture });
    return () =>
      target.removeEventListener("keydown", handler, { capture } as any);
  }, [
    /* brancher/débrancher uniquement si active/target changent */ opts.active,
    opts.target,
  ]);
}
