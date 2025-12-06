import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Home.module.css";
import AdBanner from "../../components/AdBanner/AdBanner";
import {
  IconScissors,
  IconResize,
  IconRotate,
  IconAdjustments,
  IconPalette,
  IconDeviceMobile,
  IconLock,
  IconDownload,
  IconBrandGithub,
} from "@tabler/icons-react";

const Home = () => {
  const { t } = useTranslation("home");
  const navigate = useNavigate();

  const features = [
    { icon: IconScissors, key: "crop" },
    { icon: IconResize, key: "resize" },
    { icon: IconRotate, key: "transform" },
    { icon: IconAdjustments, key: "adjustments" },
    { icon: IconPalette, key: "filters" },
    { icon: IconDownload, key: "export" },
  ];

  const highlights = [
    { icon: IconDeviceMobile, key: "pwa" },
    { icon: IconLock, key: "privacy" },
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {t("hero.title")}
            <span className={styles.heroAccent}>{t("hero.titleAccent")}</span>
          </h1>
          <p className={styles.heroSubtitle}>{t("hero.subtitle")}</p>
          <button
            className={styles.ctaButton}
            onClick={() => navigate("/editor")}
          >
            {t("hero.cta")}
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>{t("features.title")}</h2>
        <div className={styles.featuresGrid}>
          {features.map(({ icon: Icon, key }) => (
            <div key={key} className={styles.featureCard}>
              <Icon className={styles.featureIcon} size={32} />
              <h3 className={styles.featureTitle}>
                {t(`features.${key}.title`)}
              </h3>
              <p className={styles.featureDescription}>
                {t(`features.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className={styles.highlights}>
        {highlights.map(({ icon: Icon, key }) => (
          <div key={key} className={styles.highlightCard}>
            <Icon className={styles.highlightIcon} size={28} />
            <div>
              <h3 className={styles.highlightTitle}>
                {t(`highlights.${key}.title`)}
              </h3>
              <p className={styles.highlightDescription}>
                {t(`highlights.${key}.description`)}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <h2 className={styles.finalCtaTitle}>{t("finalCta.title")}</h2>
        <button
          className={styles.ctaButton}
          onClick={() => navigate("/editor")}
        >
          {t("finalCta.button")}
        </button>
      </section>

      {/* Ad Banner (solo en landing) */}
      <AdBanner />

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link to="/about" className={styles.footerLink}>
            {t("footer.about")}
          </Link>
          <Link to="/privacy" className={styles.footerLink}>
            {t("footer.privacy")}
          </Link>
          <a
            href="https://github.com/Bogdan-Andrei-Faur/PixFlow"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            <IconBrandGithub size={18} />
            GitHub
          </a>
        </div>
        <p className={styles.footerCopyright}>
          © 2025 PixFlow by Bogdan Andrei Faur
        </p>
      </footer>
    </div>
  );
};

export default Home;
