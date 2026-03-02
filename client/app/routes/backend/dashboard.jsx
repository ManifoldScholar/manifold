import { useTranslation } from "react-i18next";
// import AdminDashboard from "backend/containers/dashboards/Admin";
import HeadContent from "global/components/HeadContent";

export default function DashboardRoute() {
  const { t } = useTranslation();

  return (
    <>
      <HeadContent
        title={`${t("titles.dashboard")} | ${t("common.admin")}`}
        appendDefaultTitle
      />
      {/*<AdminDashboard />*/}
    </>
  );
}
