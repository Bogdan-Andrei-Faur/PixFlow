/* eslint-disable react-refresh/only-export-components */
import React from "react";

interface ImageEditorState {
  file: File | null;
  objectURL: string | null;
  originalFile: File | null;
}

interface ImageEditorContextValue extends ImageEditorState {
  setSourceFile: (file: File | null) => void;
  clear: () => void;
  resetToOriginal: () => void;
}

export const ImageEditorContext = React.createContext<
  ImageEditorContextValue | undefined
>(undefined);

export const ImageEditorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [file, setFile] = React.useState<File | null>(null);
  const [objectURL, setObjectURL] = React.useState<string | null>(null);
  const [originalFile, setOriginalFile] = React.useState<File | null>(null);

  const setSourceFile = React.useCallback(
    (newFile: File | null) => {
      // Revocar URL previa si existe
      if (objectURL) {
        URL.revokeObjectURL(objectURL);
        setObjectURL(null);
      }
      if (newFile) {
        const url = URL.createObjectURL(newFile);
        setFile(newFile);
        setObjectURL(url);
        // Capturar original solo la primera vez que se establece un archivo
        setOriginalFile((prev) => (prev ? prev : newFile));
      } else {
        setFile(null);
        setObjectURL(null);
        setOriginalFile(null);
      }
    },
    [objectURL]
  );

  const clear = React.useCallback(() => {
    if (objectURL) URL.revokeObjectURL(objectURL);
    setFile(null);
    setObjectURL(null);
    setOriginalFile(null);
  }, [objectURL]);

  const resetToOriginal = React.useCallback(() => {
    if (!originalFile) return;
    // Reutilizamos setSourceFile que maneja revocar la URL actual
    setSourceFile(originalFile);
  }, [originalFile, setSourceFile]);

  React.useEffect(() => {
    return () => {
      if (objectURL) URL.revokeObjectURL(objectURL);
    };
  }, [objectURL]);

  const value: ImageEditorContextValue = {
    file,
    objectURL,
    originalFile,
    setSourceFile,
    clear,
    resetToOriginal,
  };

  return (
    <ImageEditorContext.Provider value={value}>
      {children}
    </ImageEditorContext.Provider>
  );
};

// Hook movido a un archivo separado para evitar la regla
// react-refresh/only-export-components
