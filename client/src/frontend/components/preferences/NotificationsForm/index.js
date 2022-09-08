import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { UIDConsumer } from "react-uid";
import Collapse from "global/components/Collapse";
import RadioGroup from "frontend/components/privacy/CookiesForm/RadioGroup";
import ProjectPreferences from "../ProjectPreferences";
import humps from "humps";
import Authorization from "helpers/authorization";
import { useFormContext } from "react-hook-form";
import { useFromStore } from "hooks";
import * as Styled from "./styles";

export default function NotificationsForm() {
  const authentication = useFromStore("authentication");
  const { t } = useTranslation();

  const { getValues, reset } = useFormContext();

  const digestOpen = getValues("digest") !== "never";

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
    reset({
      ...otherActivity,
      digest: "never",
      "digest-projects": "never",
      digestCommentsAndAnnotations: "never"
    });
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
        <RadioGroup key={item} setting={{ key: item, label, instructions }} />
      );
    });
  };

  return (
    <>
      <UIDConsumer name={id => `project-activity-${id}`}>
        {id => (
          <Styled.FormSection
            role="group"
            aria-labelledby={`${id}-header`}
            aria-describedby={`${id}-instructions`}
          >
            <Styled.Header id={`${id}-header`}>
              {t("forms.notifications.project_activity")}
            </Styled.Header>
            <Styled.FormFields>
              <Styled.Instructions id={`${id}-instructions`}>
                {t("forms.notifications.project_activity_instructions")}
              </Styled.Instructions>
              <Collapse initialVisible={digestOpen}>
                <ProjectPreferences />
              </Collapse>
            </Styled.FormFields>
          </Styled.FormSection>
        )}
      </UIDConsumer>
      <UIDConsumer name={id => `other-activity-${id}`}>
        {id => (
          <Styled.FormSection role="group" aria-labelledby={`${id}-header`}>
            <Styled.Header id={`${id}-header`}>
              {t("forms.notifications.other_activity")}
            </Styled.Header>
            <Styled.FormFields>{renderNotificationContent()}</Styled.FormFields>
          </Styled.FormSection>
        )}
      </UIDConsumer>
      <Styled.Button
        type="button"
        className="utility-button"
        onClick={unsubscribeAll}
      >
        <span className="utility-button__text utility-button__text--underlined">
          {t("forms.notifications.unsubscribe")}
        </span>
      </Styled.Button>
    </>
  );
}
