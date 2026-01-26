import { useTranslation } from "react-i18next";
import { useLocation, Outlet } from "react-router-dom";
import Layout from "backend/components/layout";
import navigation from "helpers/router/navigation";
import HeadContent from "global/components/HeadContent";
import Authorize from "hoc/Authorize";

export default function RecordsContainer() {
  const { t } = useTranslation();
  const location = useLocation();
  const secondaryLinks = navigation.records();
  const subpage = location.pathname.split("/")[3];

  return (
    <Authorize
      ability="update"
      entity={["user", "maker", "page", "feature"]}
      failureNotification={{
        body: t("records.unauthorized")
      }}
      failureRedirect
    >
      {subpage && (
        <HeadContent
          title={`${t(
            `titles.${subpage === "reading-groups" ? "groups" : subpage}`
          )} | ${t("common.admin")}`}
          appendDefaultTitle
        />
      )}
      <div>
        <Layout.SecondaryNav links={secondaryLinks} />
        <main id="skip-to-main" tabIndex={-1} className="backend-detail">
          <Outlet />
        </main>
      </div>
    </Authorize>
  );
}

RecordsContainer.displayName = "RecordsContainer";
