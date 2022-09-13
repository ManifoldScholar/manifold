import React from "react";
import { useTranslation } from "react-i18next";
import useCollapseContext from "global/components/Collapse/useCollapseContext";
import RadioGroup from "global/components/form/hook-form/RadioGroup";
import { useFormContext } from "react-hook-form";
import PropTypes from "prop-types";
import * as Styled from "./Styles";

function ProjectPreferences({ showAllProjects }) {
  const { toggleProps } = useCollapseContext();
  const { t } = useTranslation();

  const { watch } = useFormContext();

  const digestOpen = watch("digest") !== "never";

  const options = {
    ...(showAllProjects && {
      projects: t("forms.notifications.project_preferences.all_projects")
    }),
    followedProjects: t("forms.notifications.project_preferences.only_starred")
  };

  return (
    <>
      <RadioGroup
        setting={{
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
      />
      <Styled.CollapseGroup $expanded={digestOpen}>
        <RadioGroup
          setting={{
            key: "digest-projects",
            label: t(
              "forms.notifications.project_preferences.digest_projects_label"
            )
          }}
          options={options}
        />
        <RadioGroup
          setting={{
            key: "digestCommentsAndAnnotations",
            label: t(
              "forms.notifications.project_preferences.digest_comments_label"
            )
          }}
        />
      </Styled.CollapseGroup>
    </>
  );
}

ProjectPreferences.displayName = "Frontend.Preferences.ProjectDigest";

ProjectPreferences.propTypes = {
  showAllProjects: PropTypes.bool
};

export default ProjectPreferences;
