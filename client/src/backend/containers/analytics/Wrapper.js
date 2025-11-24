import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import HeadContent from "global/components/HeadContent";

export default function AnalyticsWrapperContainer() {
  const { t } = useTranslation();

  return (
    <>
      <HeadContent
        title={`${t("titles.analytics")} | ${t("common.admin")}`}
        appendDefaultTitle
      />
      <main id="skip-to-main" tabIndex={-1}>
        <h1 className="screen-reader-text">{t("dashboard.title")}</h1>
        <section>
          <div className="container">
            <Outlet />
          </div>
        </section>
      </main>
    </>
  );
}
