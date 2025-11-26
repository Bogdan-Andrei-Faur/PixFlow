import React from "react";
import styles from "./ExportModal.module.css";
import { IconX, IconInfoCircle } from "@tabler/icons-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (
    format: "png" | "jpeg" | "webp",
    quality: number,
    fileName: string
  ) => void;
  fileName?: string;
  currentFileSize?: number;
  imageRef?: React.RefObject<HTMLImageElement | null>;
  naturalDims?: { w: number; h: number } | null;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  fileName,
  currentFileSize,
  imageRef,
  naturalDims,
}) => {
  const [format, setFormat] = React.useState<"png" | "jpeg" | "webp">("png");
  const [quality, setQuality] = React.useState(0.92);
  const [editableName, setEditableName] = React.useState("");
  const [estimatedSize, setEstimatedSize] = React.useState<number | null>(null);
  const [isCalculating, setIsCalculating] = React.useState(false);

  // Ajustar calidad al 100% cuando se selecciona PNG
  React.useEffect(() => {
    if (format === "png") {
      setQuality(1);
    }
  }, [format]);

  // Inicializar nombre editable cuando se abre el modal
  React.useEffect(() => {
    if (isOpen && fileName) {
      const nameWithoutExt = fileName.split(".")[0];
      setEditableName(nameWithoutExt);
    }
  }, [isOpen, fileName]);

  // Calcular tamaño estimado cuando cambian formato o calidad
  React.useEffect(() => {
    if (!isOpen || !imageRef?.current || !naturalDims) return;

    const calculateSize = async () => {
      setIsCalculating(true);
      const canvas = document.createElement("canvas");
      canvas.width = naturalDims.w;
      canvas.height = naturalDims.h;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setIsCalculating(false);
        return;
      }

      ctx.drawImage(imageRef.current!, 0, 0);

      const mimeType =
        format === "jpeg"
          ? "image/jpeg"
          : format === "webp"
          ? "image/webp"
          : "image/png";
      const exportQuality = format === "png" ? undefined : quality;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setEstimatedSize(blob.size);
          }
          setIsCalculating(false);
        },
        mimeType,
        exportQuality
      );
    };

    calculateSize();
  }, [format, quality, isOpen, imageRef, naturalDims]);

  if (!isOpen) return null;

  const handleExport = () => {
    const ext = format === "jpeg" ? "jpg" : format;
    const finalFileName = `${editableName || "imagen"}.${ext}`;
    onExport(format, quality, finalFileName);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const getSizeDifference = () => {
    if (!currentFileSize || !estimatedSize) return null;
    const diff = estimatedSize - currentFileSize;
    const percent = ((diff / currentFileSize) * 100).toFixed(1);
    return { diff, percent };
  };

  const sizeDiff = getSizeDifference();

  const formatInfo = {
    png: {
      title: "PNG - Portable Network Graphics",
      pros: [
        "Sin pérdida de calidad",
        "Soporta transparencia",
        "Ideal para gráficos y capturas",
      ],
      cons: ["Mayor tamaño de archivo"],
    },
    jpeg: {
      title: "JPEG - Joint Photographic Experts Group",
      pros: [
        "Menor tamaño de archivo",
        "Ideal para fotografías",
        "Compatible universalmente",
      ],
      cons: ["Compresión con pérdida", "No soporta transparencia"],
    },
    webp: {
      title: "WebP - Formato moderno de Google",
      pros: [
        "Buen balance calidad/tamaño",
        "Soporta transparencia",
        "Compresión superior",
      ],
      cons: ["Menos compatible en apps antiguas"],
    },
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Exportar imagen</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <IconX size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <label className={styles.label}>Nombre del archivo:</label>
            <input
              type="text"
              value={editableName}
              onChange={(e) => setEditableName(e.target.value)}
              className={styles.fileNameInput}
              placeholder="imagen"
            />
            <span className={styles.fileExtension}>
              .{format === "jpeg" ? "jpg" : format}
            </span>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>Formato:</label>
            <div className={styles.radioGroup}>
              {(["png", "jpeg", "webp"] as const).map((fmt) => (
                <div key={fmt} className={styles.formatOption}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="format"
                      value={fmt}
                      checked={format === fmt}
                      onChange={() => setFormat(fmt)}
                    />
                    <span>{fmt.toUpperCase()}</span>
                  </label>
                  <div className={styles.tooltip}>
                    <IconInfoCircle size={20} />
                    <div className={styles.tooltipContent}>
                      <strong>{formatInfo[fmt].title}</strong>
                      <div className={styles.tooltipSection}>
                        <span className={styles.tooltipLabel}>✓ Ventajas:</span>
                        <ul>
                          {formatInfo[fmt].pros.map((pro, i) => (
                            <li key={i}>{pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.tooltipSection}>
                        <span className={styles.tooltipLabel}>
                          ✗ Desventajas:
                        </span>
                        <ul>
                          {formatInfo[fmt].cons.map((con, i) => (
                            <li key={i}>{con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>
              Calidad: {Math.round(quality * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.01"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className={styles.slider}
              disabled={format === "png"}
            />
            {format === "png" && (
              <div className={styles.qualityHint}>
                PNG no tiene compresión con pérdida
              </div>
            )}
          </div>

          <div className={styles.section}>
            <div className={styles.sizeInfo}>
              <div className={styles.sizeRow}>
                <span className={styles.sizeLabel}>Tamaño estimado:</span>
                <span className={styles.sizeValue}>
                  {isCalculating ? (
                    <span className={styles.calculating}>Calculando...</span>
                  ) : estimatedSize ? (
                    formatBytes(estimatedSize)
                  ) : (
                    "-"
                  )}
                </span>
              </div>
              {currentFileSize && estimatedSize && sizeDiff && (
                <div className={styles.sizeRow}>
                  <span className={styles.sizeLabel}>Diferencia:</span>
                  <span
                    className={`${styles.sizeValue} ${
                      sizeDiff.diff > 0
                        ? styles.sizeIncrease
                        : styles.sizeDecrease
                    }`}
                  >
                    {sizeDiff.diff > 0 ? "+" : ""}
                    {formatBytes(Math.abs(sizeDiff.diff))} ({sizeDiff.percent}%)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancelar
          </button>
          <button
            className={styles.exportButton}
            onClick={handleExport}
            disabled={!editableName.trim()}
          >
            Descargar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
