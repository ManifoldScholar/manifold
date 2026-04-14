import { useAuthentication } from "hooks";
import Authorize from "components/hoc/Authorize";
import DashboardComponents from "./parts";
import PageHeader from "components/backend/layout/PageHeader";
import Authorization from "helpers/authorization";
import { useTranslation } from "react-i18next";

export default function AdminDashboard() {
  const authentication = useAuthentication();
  const { t } = useTranslation();

  const authorization = new Authorization();
  const canSeeAnalytics = authorization.authorizeAbility({
    authentication,
    entity: "statistics",
    ability: "read"
  });

  const analytics = (
    <Authorize entity="statistics" ability={"read"}>
      <PageHeader
        type="analytics"
        link={{
          path: "/backend/analytics",
          label: t("actions.see_all")
        }}
        titleTag="h2"
        title={t("analytics.global_header")}
      />

      <DashboardComponents.Analytics />
    </Authorize>
  );

  const guts = canSeeAnalytics ? (
    <>
      <div className="left">
        <DashboardComponents.ProjectsList />
        <DashboardComponents.JournalsList />
      </div>
      <div className="right">{analytics}</div>
    </>
  ) : (
    <>
      <div className="left">
        <DashboardComponents.ProjectsList />
      </div>
      <div className="right">
        <DashboardComponents.JournalsList />
      </div>
    </>
  );

  return (
    <main id="skip-to-main" tabIndex={-1}>
      <h1 className="screen-reader-text">{t("dashboard.title")}</h1>
      <section>
        <div className="container">
          <section className="backend-dashboard">{guts}</section>
        </div>
      </section>
    </main>
  );
}
