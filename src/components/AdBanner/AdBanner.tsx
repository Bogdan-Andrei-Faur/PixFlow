import React from "react";
import { useLocation } from "react-router-dom";
import styles from "./AdBanner.module.css";

/**
 * Componente AdBanner para Google AdSense
 *
 * Solo se muestra en la landing page (/), NO en el editor
 * AdSense está activo con Publisher ID: ca-pub-6704465207739849
 */
const AdBanner = () => {
  const location = useLocation();
  const adRef = React.useRef<HTMLModElement>(null);

  React.useEffect(() => {
    if (adRef.current && location.pathname === "/") {
      try {
        const w = window as typeof window & { adsbygoogle: unknown[] };
        (w.adsbygoogle = w.adsbygoogle || []).push({});
      } catch (err) {
        console.error("AdSense error:", err);
      }
    }
  }, [location.pathname]);

  // Solo mostrar en la página principal
  if (location.pathname !== "/") {
    return null;
  }

  return (
    <div className={styles.adContainer}>
      <span className={styles.adLabel}>Publicidad</span>
      <div className={styles.adBanner}>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-6704465207739849"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </div>
  );
};

export default AdBanner;
