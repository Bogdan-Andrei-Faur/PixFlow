import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import styles from "./About.module.css";
import {
  IconArrowLeft,
  IconBrandReact,
  IconBrandTypescript,
  IconBrandGithub,
  IconMail,
} from "@tabler/icons-react";

const About = () => {
  const { t } = useTranslation("about");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const technologies = [
    { name: "React 19", icon: IconBrandReact },
    { name: "TypeScript", icon: IconBrandTypescript },
    { name: "Vite", icon: null },
    { name: "Canvas API", icon: null },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Link to="/" className={styles.backLink}>
          <IconArrowLeft size={20} />
          {t("backToHome")}
        </Link>

        <h1 className={styles.title}>{t("title")}</h1>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t("what.title")}</h2>
          <p className={styles.paragraph}>{t("what.description")}</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t("why.title")}</h2>
          <ul className={styles.list}>
            <li>{t("why.points.0")}</li>
            <li>{t("why.points.1")}</li>
            <li>{t("why.points.2")}</li>
            <li>{t("why.points.3")}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t("tech.title")}</h2>
          <div className={styles.techGrid}>
            {technologies.map(({ name, icon: Icon }) => (
              <div key={name} className={styles.techCard}>
                {Icon && <Icon className={styles.techIcon} size={24} />}
                <span>{name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t("author.title")}</h2>
          <p className={styles.paragraph}>{t("author.description")}</p>
          <div className={styles.authorLinks}>
            <a
              href="https://github.com/Bogdan-Andrei-Faur"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.authorLink}
            >
              <IconBrandGithub size={20} />
              GitHub
            </a>
            <a
              href="https://andreifaur.dev"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.authorLink}
            >
              <IconMail size={20} />
              {t("author.website")}
            </a>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t("openSource.title")}</h2>
          <p className={styles.paragraph}>{t("openSource.description")}</p>
          <a
            href="https://github.com/Bogdan-Andrei-Faur/PixFlow"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.repoButton}
          >
            <IconBrandGithub size={20} />
            {t("openSource.button")}
          </a>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t("version.title")}</h2>
          <p className={styles.paragraph}>
            <strong>{t("version.current")}:</strong> v2.3.0
          </p>
          <p className={styles.paragraph}>
            <strong>{t("version.updated")}:</strong> 6 de diciembre de 2025
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
