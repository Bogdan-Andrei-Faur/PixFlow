import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import styles from "./Privacy.module.css";
import {
  IconArrowLeft,
  IconLock,
  IconServer,
  IconChartBar,
} from "@tabler/icons-react";

const Privacy = () => {
  const { t } = useTranslation("privacy");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Link to="/" className={styles.backLink}>
          <IconArrowLeft size={20} />
          {t("backToHome")}
        </Link>

        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.lastUpdated}>
          {t("lastUpdated")}: 6 de diciembre de 2025
        </p>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <IconLock className={styles.sectionIcon} size={28} />
            <h2 className={styles.sectionTitle}>
              {t("imageProcessing.title")}
            </h2>
          </div>
          <p className={styles.paragraph}>{t("imageProcessing.description")}</p>
          <ul className={styles.list}>
            <li>{t("imageProcessing.points.0")}</li>
            <li>{t("imageProcessing.points.1")}</li>
            <li>{t("imageProcessing.points.2")}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <IconServer className={styles.sectionIcon} size={28} />
            <h2 className={styles.sectionTitle}>{t("dataStorage.title")}</h2>
          </div>
          <p className={styles.paragraph}>{t("dataStorage.description")}</p>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <IconChartBar className={styles.sectionIcon} size={28} />
            <h2 className={styles.sectionTitle}>{t("analytics.title")}</h2>
          </div>
          <p className={styles.paragraph}>{t("analytics.description")}</p>
          <ul className={styles.list}>
            <li>{t("analytics.points.0")}</li>
            <li>{t("analytics.points.1")}</li>
            <li>{t("analytics.points.2")}</li>
          </ul>
          <p className={styles.paragraph}>
            {t("analytics.policy")}{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {t("analytics.policyLink")}
            </a>
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t("cookies.title")}</h2>
          <p className={styles.paragraph}>{t("cookies.description")}</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t("thirdParty.title")}</h2>
          <p className={styles.paragraph}>{t("thirdParty.description")}</p>
          <ul className={styles.list}>
            <li>
              <strong>Google Analytics:</strong> {t("thirdParty.points.0")}
            </li>
            <li>
              <strong>Google AdSense:</strong> {t("thirdParty.points.1")}
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t("changes.title")}</h2>
          <p className={styles.paragraph}>{t("changes.description")}</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t("contact.title")}</h2>
          <p className={styles.paragraph}>
            {t("contact.description")}{" "}
            <a
              href="https://github.com/Bogdan-Andrei-Faur/PixFlow/issues"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              GitHub Issues
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
