import React from "react";

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const Home = () => {
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [previewURL, setPreviewURL] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    // Si no hay archivo (por ejemplo, el usuario cancela el diálogo)
    if (!file) {
      setImageFile(null);
      setPreviewURL(null);
      setError(null);
      return;
    }

    // Limpiar errores previos
    setError(null);

    // 1) Validar tipo de archivo (solo imagenes)
    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten archivos de imagen (PNG, JPG, etc.)");
      return;
    }

    // 2) Validar tamaño del archivo
    if (file.size > MAX_SIZE_BYTES) {
      setError(`El tamaño del archivo excede el límite de ${MAX_SIZE_MB} MB.`);
      return;
    }

    // 3) Crear URL de vista previa
    const newURL = URL.createObjectURL(file);
    setPreviewURL(newURL);
    setImageFile(file);
  };

  // 4) Limpiar URL cuando el componente se desmonte o cambie la imagen
  React.useEffect(() => {
    return () => {
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [previewURL]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">PixFlow</h1>

      <input type="file" accept="image/*" onChange={handleFileChange} />
      {error && <p>{error}</p>}

      {previewURL && !error && <img src={previewURL} alt="Preview" />}
    </div>
  );
};

export default Home;
