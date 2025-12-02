import React from "react";
import styles from "./BottomSheet.module.css";
import {
  IconAdjustments,
  IconCrop,
  IconResize,
  IconRotate,
  IconPalette,
  IconDownload,
} from "@tabler/icons-react";
import type { Tool } from "./ToolsPanel/types";

interface Props {
  activeTool: Tool;
  onSetActiveTool: (tool: Tool) => void;
  children?: React.ReactNode;
  onOpenExportModal: () => void;
}

const BottomSheet: React.FC<Props> = ({
  activeTool,
  onSetActiveTool,
  children,
  onOpenExportModal,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [startY, setStartY] = React.useState<number | null>(null);
  const [currentY, setCurrentY] = React.useState<number | null>(null);
  const sheetRef = React.useRef<HTMLDivElement>(null);

  // Expandir automáticamente cuando se selecciona una herramienta
  React.useEffect(() => {
    if (activeTool !== "none") {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [activeTool]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === null) return;
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (startY === null || currentY === null) return;

    const deltaY = currentY - startY;
    const threshold = 50;

    if (deltaY > threshold && isExpanded) {
      // Swipe down - collapse
      setIsExpanded(false);
      if (activeTool !== "none") {
        onSetActiveTool("none");
      }
    } else if (deltaY < -threshold && !isExpanded) {
      // Swipe up - expand (solo si hay herramienta activa)
      if (activeTool !== "none") {
        setIsExpanded(true);
      }
    }

    setStartY(null);
    setCurrentY(null);
  };

  const handleToolClick = (tool: Tool) => {
    if (tool === activeTool) {
      // Toggle off
      onSetActiveTool("none");
      setIsExpanded(false);
    } else {
      onSetActiveTool(tool);
      setIsExpanded(true);
    }
  };

  const tools = [
    { id: "filters" as Tool, icon: IconPalette, label: "Filtros" },
    { id: "resize" as Tool, icon: IconResize, label: "Redimensionar" },
    { id: "crop" as Tool, icon: IconCrop, label: "Recortar" },
    { id: "transform" as Tool, icon: IconRotate, label: "Rotar" },
    { id: "adjustments" as Tool, icon: IconAdjustments, label: "Ajustes" },
  ];

  return (
    <div
      ref={sheetRef}
      className={`${styles.bottomSheet} ${isExpanded ? styles.expanded : ""}`}
    >
      {/* Drag handle */}
      <div
        className={styles.dragHandle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.handle} />
      </div>

      {/* Collapsed view - tool icons */}
      {!isExpanded && (
        <div className={styles.toolsBar}>
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                className={`${styles.toolButton} ${
                  activeTool === tool.id ? styles.active : ""
                }`}
                onClick={() => handleToolClick(tool.id)}
                aria-label={tool.label}
              >
                <Icon size={24} />
              </button>
            );
          })}
          <button
            className={styles.toolButton}
            onClick={onOpenExportModal}
            aria-label="Descargar"
          >
            <IconDownload size={24} />
          </button>
        </div>
      )}

      {/* Expanded view - tool controls */}
      {isExpanded && (
        <div className={styles.expandedContent}>
          <div className={styles.toolHeader}>
            <h3 className={styles.toolTitle}>
              {activeTool === "crop" && "Recortar"}
              {activeTool === "resize" && "Redimensionar"}
              {activeTool === "transform" && "Transformar"}
              {activeTool === "adjustments" && "Ajustes"}
              {activeTool === "filters" && "Filtros"}
            </h3>
          </div>
          <div className={styles.toolControls}>{children}</div>
        </div>
      )}
    </div>
  );
};

export default BottomSheet;
