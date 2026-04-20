import { Outlet, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { settingsAPI } from "api";
import authorize from "app/routes/utility/loaders/authorize";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import Layout from "components/backend/layout";
import HeadContent from "components/global/HeadContent";
import navigation from "helpers/navigation";

export const loader = async ({ request, context }) => {
  await authorize({
    request,
    context,
    entity: "settings",
    ability: "update"
  });

  return loadEntity({
    context,
    fetchFn: () => settingsAPI.show(),
    request
  });
};

export default function SettingsLayout({ loaderData: settings }) {
  const { t } = useTranslation();
  const location = useLocation();
  const secondaryLinks = navigation.settings();

  const subpage = location.pathname.split("/")[3]?.replace("-", "_");
  const subpageOverride = subpage === "properties" ? "settings" : null;

  return (
    <>
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
            <Outlet context={settings} />
          </div>
        </main>
      </section>
    </>
  );
}
