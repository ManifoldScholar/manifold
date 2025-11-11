import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { GroupSettingsForm } from "frontend/components/reading-group/forms";
import Layout from "backend/components/layout";

export default function ReadingGroupsNewContainer({ onSuccess }) {
  const { t } = useTranslation();
  return (
    <section>
      <Layout.DrawerHeader title={t("forms.reading_group.drawer_title")} />
      <GroupSettingsForm mode="new" onSuccess={onSuccess} />
    </section>
  );
}

ReadingGroupsNewContainer.displayName = "Frontend.Containers.ReadingGroupsNew";

ReadingGroupsNewContainer.propTypes = {
  onSuccess: PropTypes.func.isRequired
};
