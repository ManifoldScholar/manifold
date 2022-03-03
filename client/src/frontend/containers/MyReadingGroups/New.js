import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { GroupSettingsForm } from "frontend/components/reading-group/forms";
import connectAndFetch from "utils/connectAndFetch";
import Navigation from "backend/components/navigation";

function ReadingGroupsNewContainer({ onSuccess }) {
  const { t } = useTranslation();
  return (
    <section>
      <Navigation.DrawerHeader title={t("forms.reading_group.drawer_title")} />
      <GroupSettingsForm mode="new" onSuccess={onSuccess} />
    </section>
  );
}

export default connectAndFetch(ReadingGroupsNewContainer);

ReadingGroupsNewContainer.displayName = "Frontend.Containers.ReadingGroupsNew";

ReadingGroupsNewContainer.propTypes = {
  onSuccess: PropTypes.func.isRequired
};
