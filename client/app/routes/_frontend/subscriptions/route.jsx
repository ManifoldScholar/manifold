import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSubmit } from "react-router";
import requireLogin from "app/routes/utility/loaders/requireLogin";
import { meAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import NotificationsForm from "frontend/components/preferences/NotificationsForm";
import Form from "global/components/form";
import { useAuthentication, useNotifications } from "hooks";
import HeadContent from "global/components/HeadContent";
import * as Styled from "./styles";

export const loader = async ({ request, context }) => {
  requireLogin(request, context);
  return null;
};

export async function action({ request, context }) {
  const data = await request.json();

  try {
    const result = await queryApi(meAPI.update(data.attributes), context);

    if (result?.errors) {
      return { errors: result.errors };
    }
    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}

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
