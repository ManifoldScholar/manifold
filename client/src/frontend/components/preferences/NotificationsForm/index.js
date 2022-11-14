import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Form from "global/components/form";
import Collapse from "global/components/Collapse";
import RadioGroup from "../RadioGroup";
import ProjectPreferences from "../ProjectPreferences";
import humps from "humps";
import Authorization from "helpers/authorization";
import { useFromStore } from "hooks";
import * as Styled from "./styles";

export default function NotificationsForm({
  showAllProjects,
  preferences,
  setPreferences
}) {
  const authentication = useFromStore("authentication");
  const { t } = useTranslation();

  const digestOpen = preferences?.digest !== "never";

  const otherActivityOptions = useMemo(() => {
    const authorization = new Authorization();

    const items = ["repliesToMe"];

    const isAdmin = authorization.authorizeKind({
      authentication,
      kind: "admin"
    });
    const isProjectCreator = authorization.authorizeKind({
      authentication,
      kind: "project_creator"
    });

    if (isAdmin || isProjectCreator)
      items.push("projectCommentsAndAnnotations");
    if (isAdmin) items.push("flaggedResources");

    return items;
  }, [authentication]);

  const unsubscribeAll = () => {
    const otherActivity = otherActivityOptions.reduce(
      (obj, option) => ({ ...obj, [option]: "never" }),
      {}
    );
    setPreferences({
      ...otherActivity,
      digest: "never",
      digestCommentsAndAnnotations: "never"
    });
  };

  const onPreferenceChange = e => {
    const update = { ...preferences, [e.target.name]: e.target.value };
    setPreferences(update);
  };

  const onDigestChange = e => {
    const toInclude = e.target.value;
    const toExclude =
      e.target.value === "projects" ? "followedProjects" : "projects";

    const update = {
      ...preferences,
      [toInclude]: "always",
      [toExclude]: "never"
    };

    setPreferences(update);
  };

  const renderNotificationContent = () => {
    return otherActivityOptions.map(item => {
      const i18nKey = humps.decamelize(item, { separator: "_" }).toLowerCase();
      const label = t(
        `forms.notifications.activity_preferences.${i18nKey}_label`
      );
      const instructions = t(
        `forms.notifications.activity_preferences.${i18nKey}_instructions`
      );

      return (
        <RadioGroup
          key={item}
          value={preferences[item]}
          onChange={onPreferenceChange}
          preference={{ key: item, label, instructions }}
        />
      );
    });
  };

  return (
    <>
      <Styled.FieldGroup
        label={t("forms.notifications.project_activity")}
        instructions={t("forms.notifications.project_activity_instructions")}
      >
        <Collapse initialVisible={digestOpen}>
          <ProjectPreferences
            showAllProjects={showAllProjects}
            preferences={preferences}
            onChange={onPreferenceChange}
            onDigestChange={onDigestChange}
          />
        </Collapse>
      </Styled.FieldGroup>
      <Form.FieldGroup label={t("forms.notifications.other_activity")}>
        {renderNotificationContent()}
      </Form.FieldGroup>
      <Styled.Button className="utility-button" onClick={unsubscribeAll}>
        <span className="utility-button__text utility-button__text--underlined">
          {t("forms.notifications.unsubscribe")}
        </span>
      </Styled.Button>
    </>
  );
}

NotificationsForm.displayName = "Frontend.Preferences.NotificationsForm";

NotificationsForm.propTypes = {
  showAllProjects: PropTypes.bool
};
