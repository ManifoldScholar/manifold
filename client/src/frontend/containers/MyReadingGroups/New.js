import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { GroupSettingsForm } from "frontend/components/reading-group/forms";
import Layout from "backend/components/layout";

export default function ReadingGroupsNewContainer() {
  const { onSuccess } = useOutletContext() || {};
  const { t } = useTranslation();
  return (
    <section>
      <Layout.DrawerHeader title={t("forms.reading_group.drawer_title")} />
      <GroupSettingsForm mode="new" onSuccess={onSuccess} />
    </section>
  );
}

ReadingGroupsNewContainer.displayName = "Frontend.Containers.ReadingGroupsNew";
