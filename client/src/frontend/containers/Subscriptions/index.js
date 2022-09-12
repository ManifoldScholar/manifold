import React from "react";
import { meAPI } from "api";
import NotificationsForm from "frontend/components/preferences/NotificationsForm";
import lh from "helpers/linkHandler";
import PropTypes from "prop-types";
import Authorize from "hoc/Authorize";
import { useTranslation } from "react-i18next";
import { useFromStore, useNotification } from "hooks";
import BaseHookForm from "global/components/sign-in-up/BaseHookForm";
import { useUID } from "react-uid";
import omit from "lodash/omit";
import * as Styled from "./styles";

export default function SubscriptionsContainer() {
  const { t } = useTranslation();
  const { currentUser } = useFromStore("authentication") ?? {};

  const notificationPreferences =
    currentUser?.attributes?.notificationPreferences ?? {};

  const defaultValues = {
    ...omit(notificationPreferences, ["projects", "followedProjects"]),
    "digest-projects":
      notificationPreferences.projects === "always"
        ? "projects"
        : "followedProjects"
  };

  const showAllProjects = !!notificationPreferences.projects;

  const notifyUpdate = useNotification(() => ({
    level: 0,
    id: `CURRENT_USER_UPDATED`,
    heading: t("forms.signin_overlay.update_notification_header"),
    expiration: 3000
  }));

  const formatData = data => {
    const prefs = {
      ...omit(data, ["digest-projects"]),
      projects: data["digest-projects"] === "projects" ? "always" : "never",
      followedProjects:
        data["digest-projects"] === "followedProjects" ? "always" : "never"
    };
    return { notificationPreferencesByKind: prefs };
  };

  const uid = useUID();

  return (
    <Authorize
      kind="any"
      failureRedirect={lh.link("frontendLogin")}
      failureNotification={{
        heading: t("errors.unauthorized.heading"),
        body: t("errors.unauthorized.body"),
        level: 2
      }}
    >
      <section className="bg-neutral05">
        <Styled.Container>
          <Styled.FormWrapper>
            <Styled.Heading id={uid}>
              {t("forms.notifications.title")}
              <Styled.Instructions>
                {t("forms.notifications.instructions")}
              </Styled.Instructions>
            </Styled.Heading>
            <BaseHookForm
              defaultValues={defaultValues}
              ariaLabelledBy={uid}
              formatData={formatData}
              onSuccess={notifyUpdate}
              apiMethod={meAPI.update}
            >
              {errors => (
                <>
                  <NotificationsForm
                    errors={errors}
                    showAllProjects={showAllProjects}
                  />
                  <Styled.Button
                    type="submit"
                    label="forms.notifications.submit_label"
                  />
                </>
              )}
            </BaseHookForm>
          </Styled.FormWrapper>
        </Styled.Container>
      </section>
    </Authorize>
  );
}
