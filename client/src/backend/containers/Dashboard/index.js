import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import AdminDashboard from "backend/containers/dashboards/Admin";
import Authorize from "hoc/Authorize";
import HeadContent from "global/components/HeadContent";

export default function DashboardContainer() {
  const { t } = useTranslation();
  return (
    <Authorize
      kind={[
        "admin",
        "editor",
        "marketeer",
        "project_creator",
        "project_editor",
        "project_property_manager",
        "journal_editor"
      ]}
      failureNotification
    >
      <HeadContent
        title={`${t("titles.dashboard")} | ${t("common.admin")}`}
        appendDefaultTitle
      />
      <AdminDashboard />
    </Authorize>
  );
}
