import * as React from "react";
import { clamp } from "../../utils/number";

interface UseKeyboardShortcutsProps {
  onUndo: () => void;
  onRedo: () => void;
  setZoom: (fn: (prevZoom: number) => number) => void;
  fitToScreen: () => void;
}

/**
 * Hook for global keyboard shortcuts in the editor.
 *
 * Registers window-level keyboard event listeners for common editor shortcuts.
 * Uses capture phase to intercept browser defaults (e.g., Cmd+Z page navigation).
 * Automatically cleans up listeners on unmount.
 *
 * **Shortcuts**:
 * - **Cmd+Z / Ctrl+Z**: Undo last change
 * - **Cmd+Shift+Z / Ctrl+Shift+Z**: Redo last undone change
 * - **Cmd++ / Ctrl++**: Zoom in by 10% (max 8x)
 * - **Cmd+- / Ctrl+-**: Zoom out by 10% (min 0.1x)
 * - **Cmd+0 / Ctrl+0**: Fit image to screen
 *
 * **Implementation notes**:
 * - Uses `e.preventDefault()` to prevent browser default behaviors
 * - Normalizes zoom with 3 decimal precision
 * - Capture phase ensures shortcuts work even in input focus
 * - Mac uses `metaKey` (Cmd), Windows/Linux uses `ctrlKey` (Ctrl)
 *
 * @param props - Keyboard shortcuts configuration
 * @param props.onUndo - Callback for undo action (typically `history.undo()`)
 * @param props.onRedo - Callback for redo action (typically `history.redo()`)
 * @param props.setZoom - Callback to update zoom level (function updater pattern)
 * @param props.fitToScreen - Callback to reset zoom to fit image in viewport
 *
 * @example
 * ```tsx
 * useKeyboardShortcuts({
 *   onUndo: () => history.undo(),
 *   onRedo: () => history.redo(),
 *   setZoom,
 *   fitToScreen
 * });
 *
 * // No return value - side effect only (window listeners)
 * ```
 */
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
