import * as React from "react";
import { clamp } from "../utils/number";

interface UseKeyboardShortcutsProps {
  onUndo: () => void;
  onRedo: () => void;
  setZoom: (fn: (prevZoom: number) => number) => void;
  fitToScreen: () => void;
}

export function useKeyboardShortcuts({
  onUndo,
  onRedo,
  setZoom,
  fitToScreen,
}: UseKeyboardShortcutsProps) {
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Deshacer
      if (e.metaKey && !e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        onUndo();
        return;
      }
      // Rehacer
      if (e.metaKey && e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        onRedo();
        return;
      }
      // Zoom in
      if (e.metaKey && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        setZoom((z) => clamp(parseFloat((z * 1.1).toFixed(3)), 0.1, 8));
        return;
      }
      // Zoom out
      if (e.metaKey && e.key === "-") {
        e.preventDefault();
        setZoom((z) => clamp(parseFloat((z / 1.1).toFixed(3)), 0.1, 8));
        return;
      }
      // Fit to screen
      if (e.metaKey && e.key === "0") {
        e.preventDefault();
        fitToScreen();
        return;
      }
    };

    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () =>
      window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, [onUndo, onRedo, setZoom, fitToScreen]);
}
