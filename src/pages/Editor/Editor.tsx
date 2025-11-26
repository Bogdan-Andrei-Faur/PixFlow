import React from "react";
import styles from "./Editor.module.css";
import { useImageEditor } from "../../context/useImageEditor";
import { useNavigate } from "react-router-dom";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import cropStyles from "./components/ReactCropContainer.module.css";
import ZoomControls from "./components/ZoomControls";
import TopBar from "./components/TopBar";
import ToolsPanel from "./components/ToolsPanel";
import { clamp } from "./utils/number";
import { useZoomPan } from "./hooks/useZoomPan";

const Editor: React.FC = () => {
  const { objectURL, file, clear, setSourceFile, resetToOriginal } =
    useImageEditor();
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStart = React.useRef<{
    x: number;
    y: number;
    ox: number;
    oy: number;
  } | null>(null);
  const imgRef = React.useRef<HTMLImageElement | null>(null);
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const [natural, setNatural] = React.useState<{ w: number; h: number } | null>(
    null
  );
  const [theme, setTheme] = React.useState<"dark" | "light">("dark");

  // Historial de ediciones (deshacer/rehacer)
  type Snapshot = {
    file: File;
    natural: { w: number; h: number };
    zoom: number;
    offset: { x: number; y: number };
  };
  const [undoStack, setUndoStack] = React.useState<Snapshot[]>([]);
  const [redoStack, setRedoStack] = React.useState<Snapshot[]>([]);

  // Zoom y Pan centralizados en un hook
  const {
    zoom,
    setZoom,
    offset,
    setOffset,
    handleWheel,
    fitToScreen,
    setOneToOne,
  } = useZoomPan(natural, viewportRef);

  // Estado para react-image-crop
  const [crop, setCrop] = React.useState<Crop>();
  const [completedCrop, setCompletedCrop] = React.useState<PixelCrop>();
  const [completedPercentCrop, setCompletedPercentCrop] =
    React.useState<Crop>();

  // Estado para herramientas de edición
  const [activeTool, setActiveTool] = React.useState<
    "none" | "crop" | "resize" | "format"
  >("none");
  const [newWidth, setNewWidth] = React.useState<number>(0);
  const [newHeight, setNewHeight] = React.useState<number>(0);
  const [maintainAspect, setMaintainAspect] = React.useState(true);
  const [targetFormat, setTargetFormat] = React.useState<
    "png" | "jpeg" | "webp"
  >("png");
  const [jpegQuality, setJpegQuality] = React.useState(0.92);

  // Si no hay imagen, mostrar estado vacío
  React.useEffect(() => {
    if (!objectURL) {
      // Podríamos redirigir automáticamente: navigate('/')
    }
  }, [objectURL]);

  // Ajustar zoom cuando cambie la imagen o sus dimensiones naturales
  React.useEffect(() => {
    if (objectURL && natural && imgRef.current) {
      requestAnimationFrame(() => fitToScreen());
    }
  }, [objectURL, natural, fitToScreen]);

  const startDrag = (e: React.PointerEvent) => {
    if (!objectURL || !imgRef.current || !viewportRef.current) return;
    // En modo crop, react-easy-crop maneja los eventos
    if (activeTool === "crop") return;

    // Modo pan normal
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      ox: offset.x,
      oy: offset.y,
    };
  };
  const onDrag = (e: React.PointerEvent) => {
    if (!imgRef.current || !viewportRef.current) return;
    // En modo crop, react-easy-crop maneja los eventos
    if (activeTool === "crop") return;

    // Pan normal
    if (!isDragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setOffset({ x: dragStart.current.ox + dx, y: dragStart.current.oy + dy });
  };

  const endDrag = () => {
    // En modo crop, react-easy-crop maneja los eventos
    if (activeTool === "crop") return;

    // Pan normal
    setIsDragging(false);
    dragStart.current = null;
  };

  const resetView = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const resetAll = () => {
    // Restaurar imagen original (si existe)
    resetToOriginal();

    // Limpiar estado de edición
    setActiveTool("none");
    setCrop(undefined);
    setCompletedCrop(undefined);
    setCompletedPercentCrop(undefined);

    // Limpiar historial
    setUndoStack([]);
    setRedoStack([]);

    // Reset de vista; el ajuste a pantalla ocurrirá automáticamente
    resetView();
  };

  // fitToScreen y setOneToOne vienen del hook

  const applyCrop = () => {
    if (!completedPercentCrop || !natural || !imgRef.current) return;

    // Convertir porcentajes a píxeles de la imagen natural
    const cropX = (completedPercentCrop.x / 100) * natural.w;
    const cropY = (completedPercentCrop.y / 100) * natural.h;
    const cropWidth = (completedPercentCrop.width / 100) * natural.w;
    const cropHeight = (completedPercentCrop.height / 100) * natural.h;

    console.log("percentCrop:", completedPercentCrop);
    console.log("Converted to pixels:", {
      cropX,
      cropY,
      cropWidth,
      cropHeight,
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = Math.round(cropWidth);
    canvas.height = Math.round(cropHeight);

    // Dibujar la porción recortada con coordenadas absolutas
    ctx.drawImage(
      imgRef.current,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    // Convertir a blob y crear nueva URL
    canvas.toBlob((blob) => {
      if (!blob) return;

      // Guardar snapshot actual para poder deshacer
      if (file && natural) {
        const snap: Snapshot = {
          file,
          natural: { ...natural },
          zoom,
          offset: { ...offset },
        };
        setUndoStack((s) => [...s, snap]);
        setRedoStack([]);
      }

      const newFile = new File([blob], file?.name || "cropped.png", {
        type: "image/png",
      });

      // Actualizar el contexto con la nueva imagen
      setSourceFile(newFile);

      // Actualizar dimensiones naturales
      setNatural({ w: canvas.width, h: canvas.height });

      // Limpiar el crop y marcar como aplicado
      setCrop(undefined);
      setCompletedCrop(undefined);
      setCompletedPercentCrop(undefined);
      setActiveTool("none");

      // Reset zoom y offset
      requestAnimationFrame(() => fitToScreen());
    });
  };

  const undo = React.useCallback(() => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    const current: Snapshot | null =
      file && natural ? { file, natural, zoom, offset } : null;

    // Restaurar imagen y vista
    setSourceFile(prev.file);
    setNatural({ ...prev.natural });
    setZoom(prev.zoom);
    setOffset({ ...prev.offset });

    // Limpiar estados de recorte/herramienta
    setActiveTool("none");
    setCrop(undefined);
    setCompletedCrop(undefined);
    setCompletedPercentCrop(undefined);

    setUndoStack((s) => s.slice(0, -1));
    if (current) setRedoStack((r) => [...r, current]);
  }, [
    undoStack,
    file,
    natural,
    zoom,
    offset,
    setSourceFile,
    setZoom,
    setOffset,
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

    setActiveTool("none");
    setCrop(undefined);
    setCompletedCrop(undefined);
    setCompletedPercentCrop(undefined);

    setRedoStack((s) => s.slice(0, -1));
    if (current) setUndoStack((u) => [...u, current]);
  }, [
    redoStack,
    file,
    natural,
    zoom,
    offset,
    setSourceFile,
    setZoom,
    setOffset,
  ]);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Deshacer / Rehacer
      if (e.metaKey && !e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
        return;
      }
      if (e.metaKey && e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        redo();
        return;
      }
      if (e.metaKey && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        setZoom((z) => clamp(parseFloat((z * 1.1).toFixed(3)), 0.1, 8));
      } else if (e.metaKey && e.key === "-") {
        e.preventDefault();
        setZoom((z) => clamp(parseFloat((z / 1.1).toFixed(3)), 0.1, 8));
      } else if (e.metaKey && e.key === "0") {
        e.preventDefault();
        fitToScreen();
      }
    };
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () =>
      window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, [fitToScreen, setZoom, undo, redo]);

  const exitEditor = () => {
    clear();
    navigate("/");
  };

  const handleExport = async () => {
    if (!imgRef.current || !natural) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Si hay recorte activo, usar esas coordenadas
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = natural.w;
    let sourceHeight = natural.h;

    if (completedCrop) {
      sourceX = Math.max(0, Math.min(completedCrop.x, natural.w));
      sourceY = Math.max(0, Math.min(completedCrop.y, natural.h));
      sourceWidth = Math.min(completedCrop.width, natural.w - sourceX);
      sourceHeight = Math.min(completedCrop.height, natural.h - sourceY);
    }

    // Determinar dimensiones finales
    const finalWidth =
      activeTool === "resize" && newWidth > 0
        ? newWidth
        : Math.round(sourceWidth);
    const finalHeight =
      activeTool === "resize" && newHeight > 0
        ? newHeight
        : Math.round(sourceHeight);

    canvas.width = finalWidth;
    canvas.height = finalHeight;

    // Dibujar imagen recortada y/o redimensionada
    ctx.drawImage(
      imgRef.current,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      finalWidth,
      finalHeight
    );

    // Exportar con el formato seleccionado
    const mimeType =
      targetFormat === "jpeg"
        ? "image/jpeg"
        : targetFormat === "webp"
        ? "image/webp"
        : "image/png";
    const quality = targetFormat === "jpeg" ? jpegQuality : 0.92;

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const ext = targetFormat === "jpeg" ? "jpg" : targetFormat;
        a.download = `${file?.name.split(".")[0] || "imagen"}.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
      },
      mimeType,
      quality
    );
  };

  return (
    <div className={styles.editorRoot}>
      <TopBar
        fileName={file?.name}
        fileSizeKB={file ? (file.size / 1024).toFixed(1) : undefined}
        theme={theme}
        onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
        onReset={resetAll}
        onExit={exitEditor}
        onUndo={undo}
        onRedo={redo}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
      />

      <div className={styles.mainContent}>
        {/* Panel lateral de herramientas */}
        <ToolsPanel
          activeTool={activeTool}
          onSetActiveTool={(t) => {
            if (t === "none" && activeTool === "crop") {
              setCrop(undefined);
              setCompletedCrop(undefined);
              setCompletedPercentCrop(undefined);
            }
            if (t === "resize" && activeTool !== "resize" && natural) {
              setNewWidth(natural.w);
              setNewHeight(natural.h);
            }
            setActiveTool(t);
          }}
          cropRect={
            completedCrop
              ? {
                  x: completedCrop.x,
                  y: completedCrop.y,
                  width: completedCrop.width,
                  height: completedCrop.height,
                }
              : null
          }
          natural={natural}
          onInitCropIfNeeded={() => {
            // react-image-crop no necesita inicialización
          }}
          onApplyCrop={applyCrop}
          onCancelCrop={() => {
            setCrop(undefined);
            setCompletedCrop(undefined);
            setCompletedPercentCrop(undefined);
            setActiveTool("none");
          }}
          newWidth={newWidth}
          newHeight={newHeight}
          maintainAspect={maintainAspect}
          onChangeWidth={(w) => {
            setNewWidth(w);
            if (maintainAspect && natural)
              setNewHeight(Math.round((w * natural.h) / natural.w));
          }}
          onChangeHeight={(h) => {
            setNewHeight(h);
            if (maintainAspect && natural)
              setNewWidth(Math.round((h * natural.w) / natural.h));
          }}
          onToggleAspect={setMaintainAspect}
          targetFormat={targetFormat}
          jpegQuality={jpegQuality}
          onChangeFormat={setTargetFormat}
          onChangeQuality={setJpegQuality}
          onExport={handleExport}
        />

        {/* Área del canvas */}
        <div
          className={`${styles.canvasWrapper} ${
            theme === "dark"
              ? styles.checkerboardDark
              : styles.checkerboardLight
          }`}
        >
          {!objectURL && (
            <div className={styles.emptyState}>
              No hay imagen cargada. Vuelve y selecciona una.
            </div>
          )}
          {objectURL && (
            <div
              className={`${styles.viewport} ${
                isDragging ? styles.dragging : ""
              }`}
              ref={viewportRef}
              onPointerDown={startDrag}
              onPointerMove={onDrag}
              onPointerUp={endDrag}
              onPointerLeave={endDrag}
              onWheel={handleWheel}
            >
              <img
                ref={imgRef}
                src={objectURL}
                alt={file?.name || "Imagen"}
                className={styles.imageLayer}
                draggable={false}
                onLoad={(e) => {
                  const t = e.currentTarget;
                  setNatural({ w: t.naturalWidth, h: t.naturalHeight });
                }}
                style={{
                  transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                  display: activeTool === "crop" ? "none" : "block",
                }}
              />

              {/* React Image Crop - renderiza dentro del viewport con zoom */}
              {activeTool === "crop" && objectURL && (
                <div
                  className={cropStyles.cropContainer}
                  style={{
                    transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                    // @ts-expect-error - CSS custom property
                    "--inverse-zoom": 1 / zoom,
                  }}
                >
                  <ReactCrop
                    crop={crop}
                    onChange={(_pixelCrop, percentCrop) => setCrop(percentCrop)}
                    onComplete={(pixelCrop, percentCrop) => {
                      setCompletedCrop(pixelCrop);
                      setCompletedPercentCrop(percentCrop);
                    }}
                    ruleOfThirds
                  >
                    <img
                      src={objectURL}
                      alt="Crop"
                      style={{
                        maxWidth: "none",
                        display: "block",
                      }}
                      width={natural?.w}
                      height={natural?.h}
                    />
                  </ReactCrop>
                </div>
              )}

              <ZoomControls
                zoom={zoom}
                onZoomOut={() =>
                  setZoom((z) =>
                    clamp(parseFloat((z / 1.1).toFixed(3)), 0.1, 4)
                  )
                }
                onSlider={(v) => setZoom(v)}
                onZoomIn={() =>
                  setZoom((z) =>
                    clamp(parseFloat((z * 1.1).toFixed(3)), 0.1, 4)
                  )
                }
                onFit={fitToScreen}
                onOneToOne={setOneToOne}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;
