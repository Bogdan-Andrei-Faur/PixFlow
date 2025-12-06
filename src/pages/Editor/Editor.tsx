import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./Editor.module.css";
import { useImageEditor } from "../../context/useImageEditor";
import { useNavigate } from "react-router-dom";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import cropStyles from "./components/shared/ReactCrop/ReactCropContainer.module.css";
import { IconUpload } from "@tabler/icons-react";

// Hooks
import {
  useZoomPan,
  usePanDrag,
  useKeyboardShortcuts,
  useEditorHistory,
  useImageExport,
  useCropTool,
  useResizeTool,
  useTransformTool,
  useAdjustmentsTool,
  useQuickFilters,
} from "./hooks";

// Components
import {
  ZoomControls,
  ZoomIndicator,
  ToolsPanel,
  TopBar,
  MobileTopBar,
  MenuDrawer,
  BottomSheet,
  ExportModal,
  MobileCropControls,
  MobileResizeControls,
  MobileTransformControls,
  MobileAdjustmentsControls,
  MobileFilterControls,
} from "./components";

// Types
import type { Tool } from "./components/desktop/ToolsPanel/types";

// Utils
import { clamp } from "./utils/number";

const Editor: React.FC = () => {
  const { t } = useTranslation("editor");
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
  const [activeTool, setActiveTool] = React.useState<Tool>("none");
  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showZoomIndicator, setShowZoomIndicator] = React.useState(false);
  const zoomIndicatorTimerRef = React.useRef<number | null>(null);

  // Manejo global de errores de memoria
  React.useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      if (e.message.includes("memory") || e.message.includes("allocation")) {
        setErrorMessage(
          "Imagen demasiado grande. Intenta con una imagen más pequeña."
        );
        setActiveTool("none");
      }
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  // Detectar cambios de tamaño de ventana para responsive
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Zoom y Pan
  const {
    zoom,
    setZoom,
    offset,
    setOffset,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    fitToScreen,
    setOneToOne,
  } = useZoomPan(natural, viewportRef);

  // Mostrar indicador de zoom cuando cambia (móvil)
  React.useEffect(() => {
    if (!isMobile) return;

    setShowZoomIndicator(true);

    if (zoomIndicatorTimerRef.current) {
      window.clearTimeout(zoomIndicatorTimerRef.current);
    }

    zoomIndicatorTimerRef.current = window.setTimeout(() => {
      setShowZoomIndicator(false);
    }, 2000);

    return () => {
      if (zoomIndicatorTimerRef.current) {
        window.clearTimeout(zoomIndicatorTimerRef.current);
      }
    };
  }, [zoom, isMobile]);

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

  // Herramienta de transformación (rotar/flip)
  const transformTool = useTransformTool({
    imgRef,
    setSourceFile,
    setNatural,
    fitToScreen,
    onBeforeTransform: () => history.saveSnapshot(),
  });

  // Herramienta de ajustes (brillo/contraste/saturación)
  const adjustmentsTool = useAdjustmentsTool({
    imgRef,
    setSourceFile,
    fitToScreen,
    onBeforeAdjust: () => history.saveSnapshot(),
  });

  // Herramienta de filtros rápidos (grises/sepia/invertir)
  const quickFilters = useQuickFilters({
    imgRef,
    setSourceFile,
    fitToScreen,
    onBeforeApply: () => history.saveSnapshot(),
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

  const handleToolChange = (
    t: "none" | "crop" | "resize" | "transform" | "adjustments" | "filters"
  ) => {
    if (t === "none" && activeTool === "crop") {
      cropTool.clearCrop();
    }
    if (t === "crop" && activeTool !== "crop") {
      cropTool.initializeCrop();
    }
    if (t === "resize" && activeTool !== "resize") {
      resizeTool.initializeResize();
    }
    if (t === "none" && activeTool === "adjustments") {
      adjustmentsTool.cancelAdjustments();
    }
    if (t === "none" && activeTool === "filters") {
      quickFilters.cancelFilter();
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
      {errorMessage && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#ef4444",
            color: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            zIndex: 1000,
            maxWidth: "90%",
            textAlign: "center",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {errorMessage}
          <button
            onClick={() => setErrorMessage(null)}
            style={{
              marginLeft: "12px",
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* TopBar - Responsive */}
      {isMobile ? (
        <MobileTopBar
          onMenuOpen={() => setIsMenuOpen(true)}
          onApply={
            activeTool === "crop"
              ? cropTool.applyCrop
              : activeTool === "resize"
              ? () => {
                  resizeTool.applyResize();
                  setActiveTool("none");
                }
              : activeTool === "adjustments"
              ? async () => {
                  await adjustmentsTool.applyAdjustments();
                  setActiveTool("none");
                }
              : activeTool === "filters"
              ? async () => {
                  await quickFilters.applyFilter();
                  setActiveTool("none");
                }
              : undefined
          }
          hasChanges={
            activeTool === "crop"
              ? !!cropTool.completedCrop
              : activeTool === "adjustments"
              ? adjustmentsTool.hasChanges
              : activeTool === "filters"
              ? quickFilters.hasChanges
              : false
          }
          activeTool={activeTool}
        />
      ) : (
        <TopBar
          fileName={file?.name}
          fileSize={file?.size}
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
      )}

      {/* Menu Drawer - Solo móvil */}
      {isMobile && (
        <MenuDrawer
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onUndo={history.undo}
          onRedo={history.redo}
          canUndo={history.canUndo}
          canRedo={history.canRedo}
          onReset={resetAll}
          onLoadNewImage={handleLoadNewImage}
          theme={theme}
          onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
          onExit={exitEditor}
        />
      )}

      <div className={styles.mainContent}>
        {/* Tools Panel/Bottom Sheet - Responsive */}
        {!isMobile ? (
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
            onInitCropIfNeeded={cropTool.initializeCrop}
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
            onRotate90={() => transformTool.applyRotation(90)}
            onRotateMinus90={() => transformTool.applyRotation(-90)}
            onRotate180={() => transformTool.applyRotation(180)}
            onFlipHorizontal={() => transformTool.applyFlip("horizontal")}
            onFlipVertical={() => transformTool.applyFlip("vertical")}
            brightness={adjustmentsTool.brightness}
            contrast={adjustmentsTool.contrast}
            saturation={adjustmentsTool.saturation}
            onChangeBrightness={adjustmentsTool.setBrightness}
            onChangeContrast={adjustmentsTool.setContrast}
            onChangeSaturation={adjustmentsTool.setSaturation}
            onApplyAdjustments={async () => {
              await adjustmentsTool.applyAdjustments();
              setActiveTool("none");
            }}
            onCancelAdjustments={() => {
              adjustmentsTool.cancelAdjustments();
              setActiveTool("none");
            }}
            hasAdjustmentChanges={adjustmentsTool.hasChanges}
            activeFilter={quickFilters.activeFilter}
            onSelectFilter={quickFilters.selectFilter}
            onApplyFilter={async () => {
              await quickFilters.applyFilter();
              setActiveTool("none");
            }}
            onCancelFilter={() => {
              quickFilters.cancelFilter();
              setActiveTool("none");
            }}
            hasFilterChanges={quickFilters.hasChanges}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />
        ) : null}

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
                    {t("noImage.title")}
                  </h2>
                  <p
                    style={{
                      opacity: 0.6,
                      fontSize: "0.95rem",
                      lineHeight: "1.5",
                    }}
                  >
                    {t("noImage.description")}
                  </p>
                </div>
                <button
                  className={`${styles.button} ${styles.primary}`}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.75rem 1.5rem",
                    fontSize: "1rem",
                  }}
                >
                  <IconUpload size={20} />
                  {t("noImage.button")}
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
              onPointerDown={
                activeTool !== "crop" ? panDrag.startDrag : undefined
              }
              onPointerMove={activeTool !== "crop" ? panDrag.onDrag : undefined}
              onPointerUp={activeTool !== "crop" ? panDrag.endDrag : undefined}
              onPointerLeave={
                activeTool !== "crop" ? panDrag.endDrag : undefined
              }
              onWheel={activeTool !== "crop" ? handleWheel : undefined}
              onTouchStart={
                activeTool !== "crop" ? handleTouchStart : undefined
              }
              onTouchMove={activeTool !== "crop" ? handleTouchMove : undefined}
              onTouchEnd={activeTool !== "crop" ? handleTouchEnd : undefined}
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
                  filter:
                    activeTool === "adjustments"
                      ? adjustmentsTool.previewFilter
                      : activeTool === "filters"
                      ? quickFilters.previewFilter
                      : "none",
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
                    ruleOfThirds={window.innerWidth > 768}
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

              {/* Zoom Controls - Solo desktop */}
              {!isMobile && (
                <ZoomControls
                  zoom={zoom}
                  onZoomOut={() =>
                    setZoom((z) =>
                      clamp(parseFloat((z / 1.1).toFixed(3)), 0.01, 4)
                    )
                  }
                  onSlider={(v) => setZoom(v)}
                  onZoomIn={() =>
                    setZoom((z) =>
                      clamp(parseFloat((z * 1.1).toFixed(3)), 0.01, 4)
                    )
                  }
                  onFit={fitToScreen}
                  onOneToOne={setOneToOne}
                />
              )}

              {/* Zoom Indicator - Solo móvil */}
              {isMobile && (
                <ZoomIndicator zoom={zoom} visible={showZoomIndicator} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sheet - Solo móvil */}
      {isMobile && objectURL && (
        <BottomSheet
          activeTool={activeTool}
          onSetActiveTool={handleToolChange}
          onOpenExportModal={() => setIsExportModalOpen(true)}
        >
          {activeTool === "crop" && (
            <MobileCropControls
              onApply={() => {
                cropTool.applyCrop();
                setActiveTool("none");
              }}
              onCancel={() => {
                cropTool.cancelCrop();
                setActiveTool("none");
              }}
              hasSelection={!!cropTool.completedCrop}
            />
          )}
          {activeTool === "resize" && (
            <MobileResizeControls
              width={resizeTool.newWidth}
              height={resizeTool.newHeight}
              maintainAspect={resizeTool.maintainAspect}
              onChangeWidth={resizeTool.handleWidthChange}
              onChangeHeight={resizeTool.handleHeightChange}
              onToggleAspect={resizeTool.setMaintainAspect}
              onApply={() => {
                resizeTool.applyResize();
                setActiveTool("none");
              }}
              onCancel={() => {
                resizeTool.cancelResize();
                setActiveTool("none");
              }}
            />
          )}
          {activeTool === "transform" && (
            <MobileTransformControls
              onRotate90={() => transformTool.applyRotation(90)}
              onRotateMinus90={() => transformTool.applyRotation(-90)}
              onRotate180={() => transformTool.applyRotation(180)}
              onFlipH={() => transformTool.applyFlip("horizontal")}
              onFlipV={() => transformTool.applyFlip("vertical")}
            />
          )}
          {activeTool === "adjustments" && (
            <MobileAdjustmentsControls
              brightness={adjustmentsTool.brightness}
              contrast={adjustmentsTool.contrast}
              saturation={adjustmentsTool.saturation}
              onChangeBrightness={adjustmentsTool.setBrightness}
              onChangeContrast={adjustmentsTool.setContrast}
              onChangeSaturation={adjustmentsTool.setSaturation}
              onApply={async () => {
                await adjustmentsTool.applyAdjustments();
                setActiveTool("none");
              }}
              onCancel={() => {
                adjustmentsTool.cancelAdjustments();
                setActiveTool("none");
              }}
              hasChanges={adjustmentsTool.hasChanges}
            />
          )}
          {activeTool === "filters" && (
            <MobileFilterControls
              activeFilter={quickFilters.activeFilter}
              onSelectFilter={(filter: string) =>
                quickFilters.selectFilter(
                  filter as "none" | "grayscale" | "sepia" | "invert"
                )
              }
              onApply={async () => {
                await quickFilters.applyFilter();
                setActiveTool("none");
              }}
              onCancel={() => {
                quickFilters.cancelFilter();
                setActiveTool("none");
              }}
              hasChanges={quickFilters.hasChanges}
            />
          )}
        </BottomSheet>
      )}

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
