import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import useCollapseContext from "global/components/Collapse/useCollapseContext";
import RadioGroup from "../RadioGroup";
import * as Styled from "./styles";

function ProjectPreferences({
  showAllProjects,
  preferences,
  onChange,
  onDigestChange
}) {
  const { toggleProps } = useCollapseContext();
  const { t } = useTranslation();

  const digestOpen = preferences?.digest !== "never";

  const options = {
    ...(showAllProjects && {
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
        options={{
          never: t("forms.notifications.project_preferences.never"),
          daily: t("forms.notifications.project_preferences.daily"),
          weekly: t("forms.notifications.project_preferences.weekly")
        }}
        inputProps={{
          ...toggleProps,
          onClick: null,
          type: "radio",
          "aria-expanded": digestOpen
        }}
        value={preferences.digest}
        onChange={onChange}
      />
      <Styled.CollapseGroup $expanded={digestOpen}>
        <>
          <RadioGroup
            preference={{
              key: "digest-projects",
              label: t(
                "forms.notifications.project_preferences.digest_projects_label"
              )
            }}
            options={options}
            value={Object.keys(preferences).find(
              prefKey => prefKey in options && preferences[prefKey] === "always"
            )}
            onChange={onDigestChange}
          />
          <RadioGroup
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

ProjectPreferences.displayName = "Frontend.Preferences.ProjectDigest";

ProjectPreferences.propTypes = {
  showAllProjects: PropTypes.bool
};

export default ProjectPreferences;
