import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSubmit } from "react-router";
import requireLogin from "app/routes/utility/loaders/requireLogin";
import { meAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import NotificationsForm from "components/frontend/preferences/NotificationsForm";
import Form from "components/global/form";
import { useAuthentication, useNotifications } from "hooks";
import HeadContent from "components/global/HeadContent";
import * as Styled from "./styles";

export const loader = async ({ request, context }) => {
  requireLogin(request, context);
  return null;
};

export const action = formAction({
  mutation: ({ data }) => meAPI.update(data.attributes)
});

export default function SubscriptionsRoute({ actionData }) {
  const { t } = useTranslation();
  const submit = useSubmit();
  const { currentUser } = useAuthentication();
  const [preferences, setPreferences] = useState(
    currentUser?.attributes?.notificationPreferences
  );

  const { addNotification } = useNotifications();

  useEffect(() => {
    if (actionData?.success) {
      addNotification({
        level: 0,
        id: `CURRENT_USER_UPDATED`,
        heading: t("forms.signin_overlay.update_notification_header"),
        expiration: 3000
      });
    }
  }, [actionData?.success, addNotification, t]);

  const formatData = () => {
    return {
      attributes: {
        notificationPreferencesByKind: preferences
      }
    };
  };

  return (
    <>
      <HeadContent title={t("titles.notifications")} appendDefaultTitle />
      <section className="bg-neutral05">
        <div className="container">
          <Styled.Form
            submit={submit}
            errors={actionData?.errors || []}
            model={{ attributes: {} }}
            formatData={formatData}
            className="form-primary"
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
    </>
  );
}
