import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import useCollapseContext from "global/components/Collapse/useCollapseContext";
import RadioGroup from "../RadioGroup";
import * as Styled from "./styles";

function ProjectPreferences({ preferences, onChange, onDigestChange }) {
  const { toggleProps } = useCollapseContext();
  const { t } = useTranslation();

  const options = {
    ...(preferences.projects && {
      projects: t("forms.notifications.project_preferences.all_projects")
    }),
    followedProjects: t("forms.notifications.project_preferences.only_starred")
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
      <Styled.CollapseGroup $expanded={preferences.digest !== "never"}>
        <>
          <RadioGroup
            preference={{
              key: "digest-projects",
              label: t(
                "forms.notifications.project_preferences.digest_projects_label"
              )
            }}
            value={Object.keys(preferences).find(
              prefKey => prefKey in options && preferences[prefKey] === "always"
            )}
            options={options}
            onChange={onDigestChange}
          />
          <RadioGroup
            key={"digestCommentsAndAnnotations"}
            preference={{
              key: "digestCommentsAndAnnotations",
              label: t(
                "forms.notifications.project_preferences.digest_comments_label"
              )
            }}
            value={preferences.digestCommentsAndAnnotations}
            onChange={onChange}
          />
        </>
      </Styled.CollapseGroup>
    </>
  );
}

ProjectPreferences.propTypes = {
  preferences: PropTypes.object,
  onChange: PropTypes.func,
  onDigestChange: PropTypes.func
};

export default ProjectPreferences;
