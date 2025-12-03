import * as React from "react";

export interface Snapshot {
  file: File;
  natural: { w: number; h: number };
  zoom: number;
  offset: { x: number; y: number };
}

interface UseEditorHistoryProps {
  file: File | null;
  natural: { w: number; h: number } | null;
  zoom: number;
  offset: { x: number; y: number };
  setSourceFile: (file: File) => void;
  setNatural: (dims: { w: number; h: number }) => void;
  setZoom: (zoom: number) => void;
  setOffset: (offset: { x: number; y: number }) => void;
  onRestore?: () => void;
}

/**
 * Hook for managing undo/redo history with snapshots.
 *
 * Implements a two-stack system for undo/redo operations. Each snapshot captures the complete
 * editor state (file, dimensions, zoom, offset) to enable full state restoration. When a new
 * change is made, redo stack is cleared (standard undo/redo behavior). Memory-efficient by
 * storing File references (not blob copies).
 *
 * **Undo/Redo mechanics**:
 * 1. **Save**: Pushes current state to undo stack, clears redo stack
 * 2. **Undo**: Pops undo stack, restores state, pushes current to redo stack
 * 3. **Redo**: Pops redo stack, restores state, pushes current to undo stack
 *
 * **Usage pattern**:
 * 1. Call `saveSnapshot()` **before** any destructive operation (crop, filter, etc.)
 * 2. Tool applies changes and creates new file
 * 3. User can `undo()` to previous state or `redo()` to revert undo
 * 4. Check `canUndo`/`canRedo` to disable UI buttons when stacks empty
 *
 * @param props - History configuration
 * @param props.file - Current source file
 * @param props.natural - Current natural dimensions
 * @param props.zoom - Current zoom level
 * @param props.offset - Current viewport offset
 * @param props.setSourceFile - Callback to restore file from snapshot
 * @param props.setNatural - Callback to restore dimensions from snapshot
 * @param props.setZoom - Callback to restore zoom from snapshot
 * @param props.setOffset - Callback to restore offset from snapshot
 * @param props.onRestore - Optional callback invoked after undo/redo (e.g., clear tool state)
 * @returns History controls and stack status
 *
 * @example
 * ```tsx
 * const history = useEditorHistory({
 *   file,
 *   natural,
 *   zoom,
 *   offset,
 *   setSourceFile,
 *   setNatural,
 *   setZoom,
 *   setOffset,
 *   onRestore: () => setActiveTool(null) // Clear tool on restore
 * });
 *
 * // In tool hooks:
 * const applyCrop = () => {
 *   history.saveSnapshot(); // Save before change
 *   // ... apply crop
 * };
 *
 * // In UI:
 * <button onClick={history.undo} disabled={!history.canUndo}>Undo</button>
 * <button onClick={history.redo} disabled={!history.canRedo}>Redo</button>
 * ```
 */
export function useEditorHistory({
  file,
  natural,
  zoom,
  offset,
  setSourceFile,
  setNatural,
  setZoom,
  setOffset,
  onRestore,
}: UseEditorHistoryProps) {
  const [undoStack, setUndoStack] = React.useState<Snapshot[]>([]);
  const [redoStack, setRedoStack] = React.useState<Snapshot[]>([]);

  const saveSnapshot = React.useCallback(() => {
    if (!file || !natural) return;
    const snap: Snapshot = {
      file,
      natural: { ...natural },
      zoom,
      offset: { ...offset },
    };
    setUndoStack((s) => [...s, snap]);
    setRedoStack([]);
  }, [file, natural, zoom, offset]);

  const undo = React.useCallback(() => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    const current: Snapshot | null =
      file && natural ? { file, natural, zoom, offset } : null;

    setSourceFile(prev.file);
    setNatural({ ...prev.natural });
    setZoom(prev.zoom);
    setOffset({ ...prev.offset });

    onRestore?.();

    setUndoStack((s) => s.slice(0, -1));
    if (current) setRedoStack((r) => [...r, current]);
  }, [
    undoStack,
    file,
    natural,
    zoom,
    offset,
    setSourceFile,
    setNatural,
    setZoom,
    setOffset,
    onRestore,
  ]);

  const redo = React.useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    const current: Snapshot | null =
      file && natural ? { file, natural, zoom, offset } : null;

    setSourceFile(next.file);
    setNatural({ ...next.natural });
    setZoom(next.zoom);
    setOffset({ ...next.offset });

    onRestore?.();

    setRedoStack((s) => s.slice(0, -1));
    if (current) setUndoStack((u) => [...u, current]);
  }, [
    redoStack,
    file,
    natural,
    zoom,
    offset,
    setSourceFile,
    setNatural,
    setZoom,
    setOffset,
    onRestore,
  ]);

  const clearHistory = React.useCallback(() => {
    setUndoStack([]);
    setRedoStack([]);
  }, []);

  return {
    undo,
    redo,
    saveSnapshot,
    clearHistory,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
  };
}
