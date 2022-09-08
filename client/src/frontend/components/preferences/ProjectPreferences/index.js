import React from "react";
import { useTranslation } from "react-i18next";
import useCollapseContext from "global/components/Collapse/useCollapseContext";
import RadioGroup from "frontend/components/privacy/CookiesForm/RadioGroup";
import { useFormContext } from "react-hook-form";
import * as Styled from "./Styles";

function ProjectPreferences() {
  const { toggleProps } = useCollapseContext();
  const { t } = useTranslation();

  const { watch } = useFormContext();

  const digestOpen = watch("digest") !== "never";

  const options = {
    ...(true && {
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

export default ProjectPreferences;
