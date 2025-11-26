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
