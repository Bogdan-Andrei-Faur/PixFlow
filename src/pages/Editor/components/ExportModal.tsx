import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation(["editor", "common"]);
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
      title: t("export.formatInfo.png.title"),
      pros: [
        t("export.formatInfo.png.pros.0"),
        t("export.formatInfo.png.pros.1"),
        t("export.formatInfo.png.pros.2"),
      ],
      cons: [t("export.formatInfo.png.cons.0")],
    },
    jpeg: {
      title: t("export.formatInfo.jpeg.title"),
      pros: [
        t("export.formatInfo.jpeg.pros.0"),
        t("export.formatInfo.jpeg.pros.1"),
        t("export.formatInfo.jpeg.pros.2"),
      ],
      cons: [
        t("export.formatInfo.jpeg.cons.0"),
        t("export.formatInfo.jpeg.cons.1"),
      ],
    },
    webp: {
      title: t("export.formatInfo.webp.title"),
      pros: [
        t("export.formatInfo.webp.pros.0"),
        t("export.formatInfo.webp.pros.1"),
        t("export.formatInfo.webp.pros.2"),
      ],
      cons: [t("export.formatInfo.webp.cons.0")],
    },
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t("export.title")}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <IconX size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <label className={styles.label}>{t("export.fileName")}</label>
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
            <label className={styles.label}>{t("export.format")}</label>
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
                        <span className={styles.tooltipLabel}>
                          ✓ {t("export.formatInfo.pros")}
                        </span>
                        <ul>
                          {formatInfo[fmt].pros.map((pro, i) => (
                            <li key={i}>{pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.tooltipSection}>
                        <span className={styles.tooltipLabel}>
                          ✗ {t("export.formatInfo.cons")}
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
              {t("export.quality")} {Math.round(quality * 100)}%
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
                {t("export.qualityHint")}
              </div>
            )}
          </div>

          <div className={styles.section}>
            <div className={styles.sizeInfo}>
              <div className={styles.sizeRow}>
                <span className={styles.sizeLabel}>
                  {t("export.estimatedSize")}
                </span>
                <span className={styles.sizeValue}>
                  {isCalculating ? (
                    <span className={styles.calculating}>
                      {t("export.calculating")}
                    </span>
                  ) : estimatedSize ? (
                    formatBytes(estimatedSize)
                  ) : (
                    "-"
                  )}
                </span>
              </div>
              {currentFileSize && estimatedSize && sizeDiff && (
                <div className={styles.sizeRow}>
                  <span className={styles.sizeLabel}>
                    {t("export.difference")}
                  </span>
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
            {t("common:buttons.cancel")}
          </button>
          <button
            className={styles.exportButton}
            onClick={handleExport}
            disabled={!editableName.trim()}
          >
            {t("export.download")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
