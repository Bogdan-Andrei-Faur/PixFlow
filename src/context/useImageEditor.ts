import React from "react";
import { ImageEditorContext } from "./ImageEditorContext";

export function useImageEditor() {
  const ctx = React.useContext(ImageEditorContext);
  if (!ctx) {
    throw new Error("useImageEditor debe usarse dentro de ImageEditorProvider");
  }
  return ctx;
}
