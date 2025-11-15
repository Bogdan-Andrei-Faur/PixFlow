import React from "react";
import styles from "./Editor.module.css";
import { useImageEditor } from "../../context/useImageEditor";
import { useNavigate } from "react-router-dom";
import {
  IconMoon,
  IconSun,
  IconLogout,
  IconPlus,
  IconMinus,
  IconAspectRatio,
  IconRestore,
  IconObjectScan,
  IconEdit,
} from "@tabler/icons-react";

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

const Editor: React.FC = () => {
  const { objectURL, file, clear } = useImageEditor();
  const navigate = useNavigate();
  const [zoom, setZoom] = React.useState(1);
  const [isDragging, setIsDragging] = React.useState(false);
  const [offset, setOffset] = React.useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
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

  // Si no hay imagen, mostrar estado vacío
  React.useEffect(() => {
    if (!objectURL) {
      // Podríamos redirigir automáticamente: navigate('/')
    }
  }, [objectURL]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey) {
      const factor = 1 - e.deltaY * 0.0015;
      setZoom((z) => clamp(parseFloat((z * factor).toFixed(3)), 0.1, 8));
    } else {
      setOffset((o) => ({ x: o.x + e.deltaX, y: o.y + e.deltaY }));
    }
  };

  const startDrag = (e: React.PointerEvent) => {
    if (!objectURL) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      ox: offset.x,
      oy: offset.y,
    };
  };
  const onDrag = (e: React.PointerEvent) => {
    if (!isDragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setOffset({ x: dragStart.current.ox + dx, y: dragStart.current.oy + dy });
  };
  const endDrag = () => {
    setIsDragging(false);
    dragStart.current = null;
  };

  const resetView = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const fitToScreen = React.useCallback(() => {
    if (!natural || !viewportRef.current) return;
    const vw = viewportRef.current.clientWidth;
    const vh = viewportRef.current.clientHeight;
    const scale = Math.min(vw / natural.w, vh / natural.h) * 0.98;
    setZoom(clamp(scale, 0.1, 8));
    setOffset({ x: 0, y: 0 });
  }, [natural]);

  const setOneToOne = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
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
  }, [fitToScreen]);

  const exitEditor = () => {
    clear();
    navigate("/");
  };

  return (
    <div className={styles.editorRoot}>
      <div className={styles.topBar}>
        <h1 className={styles.title}>
          Editor PixFlow <IconEdit size={24} />
        </h1>
        <span className={styles.metaInfo}>
          {file
            ? `${file.name} • ${(file.size / 1024).toFixed(1)} KB`
            : "Sin imagen"}
        </span>
        <div className={styles.spacer} />
        <button
          className={`${styles.button} ${styles.iconButton}`}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Cambiar tema"
        >
          {theme === "dark" ? <IconMoon size={16} /> : <IconSun size={16} />}
        </button>
        <button className={styles.button} onClick={resetView}>
          Reset <IconRestore size={16} />
        </button>
        <button
          className={`${styles.button} ${styles.primary}`}
          onClick={exitEditor}
        >
          Salir <IconLogout size={16} />
        </button>
      </div>
      <div
        className={`${styles.canvasWrapper} ${
          theme === "dark" ? styles.checkerboardDark : styles.checkerboardLight
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
                requestAnimationFrame(() => fitToScreen());
              }}
              style={{
                transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              }}
            />
            <div className={styles.zoomControls}>
              <button
                className={`${styles.button} ${styles.iconButton}`}
                onClick={() =>
                  setZoom((z) =>
                    clamp(parseFloat((z / 1.1).toFixed(3)), 0.1, 4)
                  )
                }
                aria-label="Reducir zoom"
              >
                <IconMinus size={16} />
              </button>
              <span>{Math.round(zoom * 100)}%</span>
              <input
                className={styles.range}
                type="range"
                min={0.1}
                max={4}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
              />
              <button
                className={`${styles.button} ${styles.iconButton}`}
                onClick={() =>
                  setZoom((z) =>
                    clamp(parseFloat((z * 1.1).toFixed(3)), 0.1, 4)
                  )
                }
                aria-label="Aumentar zoom"
              >
                <IconPlus size={16} />
              </button>
              <button className={styles.button} onClick={fitToScreen}>
                Encajar <IconObjectScan size={16} />
              </button>
              <button className={styles.button} onClick={setOneToOne}>
                1:1 <IconAspectRatio size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
