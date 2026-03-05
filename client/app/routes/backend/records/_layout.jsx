import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router";
import Layout from "backend/components/layout";
import navigation from "helpers/router/navigation";
import HeadContent from "global/components/HeadContent";
import authorize from "app/routes/utility/loaders/authorize";

export const loader = ({ request, context }) => {
  return authorize({
    request,
    context,
    ability: "update",
    entity: ["user", "maker", "page", "feature"]
  });
};

export default function RecordsLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const secondaryLinks = navigation.records();
  const subpage = location.pathname.split("/")[3];

  return (
    <>
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
    </>
  );
}
