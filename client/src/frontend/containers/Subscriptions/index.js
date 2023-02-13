import React, { useState } from "react";
import { meAPI } from "api";
import NotificationsForm from "frontend/components/preferences/NotificationsForm";
import lh from "helpers/linkHandler";
import PropTypes from "prop-types";
import Authorize from "hoc/Authorize";
import Form from "global/components/form";
import { useTranslation } from "react-i18next";
import { useFromStore, useNotification } from "hooks";
import HeadContent from "global/components/HeadContent";
import * as Styled from "./styles";

export default function SubscriptionsContainer() {
  const { t } = useTranslation();
  const { currentUser } = useFromStore("authentication") ?? {};
  const [preferences, setPreferences] = useState(
    currentUser?.attributes?.notificationPreferences
  );

  const notifyUpdate = useNotification(() => ({
    level: 0,
    id: `CURRENT_USER_UPDATED`,
    heading: t("forms.signin_overlay.update_notification_header"),
    expiration: 3000
  }));

  const formatData = () => {
    return { notificationPreferencesByKind: preferences };
  };

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
      <HeadContent title={t("titles.notifications")} appendDefaultTitle />
      <section className="bg-neutral05">
        <div className="container">
          <Styled.Form
            name="global-authenticated-user-update"
            update={meAPI.update}
            formatData={formatData}
            onSuccess={notifyUpdate}
          >
            <Form.Header
              label={t("forms.notifications.title")}
              instructions={t("forms.notifications.instructions")}
              styleType="primary"
            />
            <NotificationsForm
              preferences={preferences}
              setPreferences={setPreferences}
              showAllProjects={!!preferences.projects}
            />
            <input
              className="button-secondary"
              type="submit"
              value={t("forms.notifications.submit_label")}
            />
          </Styled.Form>
        </div>
      </section>
    </Authorize>
  );
}

SubscriptionsContainer.displayName = "Frontend.Containers.Subscriptions";
