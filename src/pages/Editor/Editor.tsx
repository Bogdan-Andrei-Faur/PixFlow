import React from "react";
import styles from "./Editor.module.css";
import { useImageEditor } from "../../context/useImageEditor";
import { useNavigate } from "react-router-dom";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import cropStyles from "./components/ReactCropContainer.module.css";
import ZoomControls from "./components/ZoomControls";
import TopBar from "./components/TopBar";
import ToolsPanel from "./components/ToolsPanel";
import ExportModal from "./components/ExportModal";
import { clamp } from "./utils/number";
import { useZoomPan } from "./hooks/useZoomPan";
import { useEditorHistory } from "./hooks/useEditorHistory";
import { useCropTool } from "./hooks/useCropTool";
import { usePanDrag } from "./hooks/usePanDrag";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useImageExport } from "./hooks/useImageExport";
import { useResizeTool } from "./hooks/useResizeTool";
import { IconUpload, IconHome } from "@tabler/icons-react";

const Editor: React.FC = () => {
  const { objectURL, file, clear, setSourceFile, resetToOriginal } =
    useImageEditor();
  const navigate = useNavigate();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const imgRef = React.useRef<HTMLImageElement | null>(null);
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const [natural, setNatural] = React.useState<{ w: number; h: number } | null>(
    null
  );
  const [theme, setTheme] = React.useState<"dark" | "light">("dark");
  const [activeTool, setActiveTool] = React.useState<
    "none" | "crop" | "resize"
  >("none");
  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);

  // Zoom y Pan
  const {
    zoom,
    setZoom,
    offset,
    setOffset,
    handleWheel,
    fitToScreen,
    setOneToOne,
  } = useZoomPan(natural, viewportRef);

  // Herramienta de recorte
  const cropTool = useCropTool({
    imgRef,
    natural,
    file,
    setSourceFile,
    setNatural,
    fitToScreen,
    onBeforeCrop: () => history.saveSnapshot(),
  });

  // Herramienta de redimensionado
  const resizeTool = useResizeTool({
    natural,
    imgRef,
    setSourceFile,
    setNatural,
    fitToScreen,
    onBeforeResize: () => history.saveSnapshot(),
  });

  // Historial (undo/redo)
  const history = useEditorHistory({
    file,
    natural,
    zoom,
    offset,
    setSourceFile,
    setNatural,
    setZoom,
    setOffset,
    onRestore: () => {
      setActiveTool("none");
      cropTool.clearCrop();
    },
  });

  // Pan/Drag
  const panDrag = usePanDrag({
    enabled: activeTool !== "crop",
    offset,
    setOffset,
  });

  // Exportación
  const { handleExport } = useImageExport({
    imgRef,
    natural,
    file,
    completedCrop: cropTool.completedCrop,
    activeTool,
    newWidth: resizeTool.newWidth,
    newHeight: resizeTool.newHeight,
  });

  // Atajos de teclado
  useKeyboardShortcuts({
    onUndo: history.undo,
    onRedo: history.redo,
    setZoom,
    fitToScreen,
  });

  // Ajustar zoom cuando cambie la imagen
  React.useEffect(() => {
    if (objectURL && natural && imgRef.current) {
      requestAnimationFrame(() => fitToScreen());
    }
  }, [objectURL, natural, fitToScreen]);

  const resetView = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const resetAll = () => {
    resetToOriginal();
    setActiveTool("none");
    cropTool.clearCrop();
    history.clearHistory();
    resetView();
  };

  const exitEditor = () => {
    clear();
    navigate("/");
  };

  const handleToolChange = (t: "none" | "crop" | "resize") => {
    if (t === "none" && activeTool === "crop") {
      cropTool.clearCrop();
    }
    if (t === "resize" && activeTool !== "resize") {
      resizeTool.initializeResize();
    }
    setActiveTool(t);
  };

  const handleExportWithFormat = (
    format: "png" | "jpeg" | "webp",
    quality: number,
    fileName: string
  ) => {
    handleExport(format, quality, fileName);
  };

  const handleLoadNewImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      // Limpiar historial y estado
      history.clearHistory();
      cropTool.clearCrop();
      setActiveTool("none");
      resetView();

      // Cargar nueva imagen
      setSourceFile(selectedFile);
    }
    // Limpiar input para permitir seleccionar el mismo archivo
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={styles.editorRoot}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
      <TopBar
        fileName={file?.name}
        fileSizeKB={file ? (file.size / 1024).toFixed(1) : undefined}
        theme={theme}
        onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
        onReset={resetAll}
        onExit={exitEditor}
        onUndo={history.undo}
        onRedo={history.redo}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        onLoadNewImage={handleLoadNewImage}
      />

      <div className={styles.mainContent}>
        <ToolsPanel
          activeTool={activeTool}
          onSetActiveTool={handleToolChange}
          cropRect={
            cropTool.completedCrop
              ? {
                  x: cropTool.completedCrop.x,
                  y: cropTool.completedCrop.y,
                  width: cropTool.completedCrop.width,
                  height: cropTool.completedCrop.height,
                }
              : null
          }
          natural={natural}
          onInitCropIfNeeded={() => {}}
          onApplyCrop={cropTool.applyCrop}
          onCancelCrop={() => {
            cropTool.cancelCrop();
            setActiveTool("none");
          }}
          newWidth={resizeTool.newWidth}
          newHeight={resizeTool.newHeight}
          maintainAspect={resizeTool.maintainAspect}
          onChangeWidth={resizeTool.handleWidthChange}
          onChangeHeight={resizeTool.handleHeightChange}
          onToggleAspect={resizeTool.setMaintainAspect}
          onApplyResize={() => {
            resizeTool.applyResize();
            setActiveTool("none");
          }}
          onCancelResize={() => {
            resizeTool.cancelResize();
            setActiveTool("none");
          }}
          onOpenExportModal={() => setIsExportModalOpen(true)}
        />

        <div
          className={`${styles.canvasWrapper} ${
            theme === "dark"
              ? styles.checkerboardDark
              : styles.checkerboardLight
          }`}
        >
          {!objectURL && (
            <div className={styles.emptyState}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1.5rem",
                  maxWidth: "400px",
                  textAlign: "center",
                }}
              >
                <IconUpload size={80} style={{ opacity: 0.3 }} />
                <div>
                  <h2
                    style={{
                      marginBottom: "0.75rem",
                      fontSize: "1.5rem",
                      fontWeight: 600,
                    }}
                  >
                    No hay imagen cargada
                  </h2>
                  <p
                    style={{
                      opacity: 0.6,
                      fontSize: "0.95rem",
                      lineHeight: "1.5",
                    }}
                  >
                    La imagen se perdió al refrescar la página.
                    <br />
                    Vuelve a cargar una imagen para continuar editando.
                  </p>
                </div>
                <button
                  className={`${styles.button} ${styles.primary}`}
                  onClick={() => navigate("/")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.75rem 1.5rem",
                    fontSize: "1rem",
                  }}
                >
                  <IconHome size={20} />
                  Volver a cargar imagen
                </button>
              </div>
            </div>
          )}
          {objectURL && (
            <div
              className={`${styles.viewport} ${
                panDrag.isDragging ? styles.dragging : ""
              }`}
              ref={viewportRef}
              onPointerDown={panDrag.startDrag}
              onPointerMove={panDrag.onDrag}
              onPointerUp={panDrag.endDrag}
              onPointerLeave={panDrag.endDrag}
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
                    crop={cropTool.crop}
                    onChange={(_pixelCrop, percentCrop) =>
                      cropTool.setCrop(percentCrop)
                    }
                    onComplete={(pixelCrop, percentCrop) => {
                      cropTool.setCompletedCrop(pixelCrop);
                      cropTool.setCompletedPercentCrop(percentCrop);
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

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExportWithFormat}
        fileName={file?.name}
        currentFileSize={file?.size}
        imageRef={imgRef}
        naturalDims={natural}
      />
    </div>
  );
};

export default Editor;
