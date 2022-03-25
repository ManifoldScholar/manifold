import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import config from "config";
import Collapse from "global/components/Collapse";
import useCollapseContext from "global/components/Collapse/useCollapseContext";
import RadioGroup from "./RadioGroup";

function ProjectPreferences({ preferences, onChange, onDigestChange }) {
  const { toggleProps } = useCollapseContext();
  const { t } = useTranslation();

  const items = config.app.locale.notificationPreferences.digest;
  const options = {
    ...(preferences.projects && {
      projects: t("forms.notifications.project_preferences.all_projects")
    }),
    followedProjects: t(
      "forms.notifications.project_preferences.only_following"
    )
  };

  return (
    <>
      <RadioGroup
        preference={{
          key: "digest",
          label: t("forms.notifications.project_preferences.frequency_label")
        }}
        value={preferences.digest}
        options={{
          never: t("forms.notifications.project_preferences.never"),
          daily: t("forms.notifications.project_preferences.daily"),
          weekly: t("forms.notifications.project_preferences.weekly")
        }}
        onChange={onChange}
        inputProps={{
          ...toggleProps,
          onClick: null,
          type: "radio",
          "aria-expanded":
            preferences.digest === "daily" || preferences.digest === "weekly"
        }}
      />
      <Collapse.Content>
        <div className="subscriptions__collapsed-group">
          <RadioGroup
            preference={{
              key: "digest-projects",
              label: t("forms.notifications.project_preferences.types_label")
            }}
            value={Object.keys(preferences).find(
              prefKey => prefKey in options && preferences[prefKey] === "always"
            )}
            options={options}
            onChange={onDigestChange}
          />
          {items.map(item => {
            return (
              <RadioGroup
                key={item.key}
                preference={item}
                value={preferences[item.key]}
                onChange={onChange}
              />
            );
          })}
        </div>
      </Collapse.Content>
    </>
  );
}

ProjectPreferences.propTypes = {
  preferences: PropTypes.object,
  onChange: PropTypes.func,
  onDigestChange: PropTypes.func
};

export default ProjectPreferences;
