import { useLocation, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "backend/components/layout";
import navigation from "helpers/router/navigation";
import HeadContent from "global/components/HeadContent";
import Authorize from "hoc/Authorize";

export default function SettingsWrapperContainer() {
  const { t } = useTranslation();
  const location = useLocation();
  const secondaryLinks = navigation.settings();

  const subpage = location.pathname.split("/")[3]?.replace("-", "_");
  const subpageOverride = subpage === "properties" ? "settings" : null;

  return (
    <Authorize
      entity="settings"
      failureNotification={{
        body: t("settings.unauthorized")
      }}
      failureRedirect
      ability="update"
    >
      <HeadContent
        title={`${t(`titles.${subpageOverride ?? subpage}`)} | ${t(
          "common.admin"
        )}`}
        appendDefaultTitle
      />
      <section>
        <Layout.SecondaryNav links={secondaryLinks} />
        <main id="skip-to-main" tabIndex={-1} className="backend-detail">
          <div className="panel">
            <Outlet />
          </div>
        </main>
      </section>
    </Authorize>
  );
}
