import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSubmit } from "react-router";
import requireLogin from "app/routes/utility/loaders/requireLogin";
import { ApiClient, meAPI } from "api";
import { routerContext } from "app/contexts";
import NotificationsForm from "frontend/components/preferences/NotificationsForm";
import Form from "global/components/form";
import { useCurrentUser, useNotification } from "hooks";
import HeadContent from "global/components/HeadContent";
import * as Styled from "./styles";

export { shouldRevalidate } from "app/routes/utility/loaders/shouldRevalidate";

export const loader = async ({ request, context }) => {
  requireLogin(request, context);
  return null;
};

export async function action({ request, context }) {
  const { auth } = context.get(routerContext) ?? {};

  const formData = await request.formData();
  const data = JSON.parse(formData.get("data") ?? "");
  const client = new ApiClient(auth.authToken, { denormalize: true });

  try {
    const result = await client.call(meAPI.update(data.attributes));

    if (result?.errors) {
      return { errors: result.errors };
    }

    return { success: true };
  } catch (error) {
    return {
      errors: [
        {
          detail: error.message || "Failed to update notification preferences",
          source: { pointer: "/data" }
        }
      ]
    };
  }
}

export default function SubscriptionsRoute({ actionData }) {
  const { t } = useTranslation();
  const submit = useSubmit();
  const currentUser = useCurrentUser();
  const [preferences, setPreferences] = useState(
    currentUser?.attributes?.notificationPreferences
  );

  const notifyUpdate = useNotification(() => ({
    level: 0,
    id: `CURRENT_USER_UPDATED`,
    heading: t("forms.signin_overlay.update_notification_header"),
    expiration: 3000
  }));

  useEffect(() => {
    if (actionData?.success) {
      notifyUpdate();
    }
  }, [actionData?.success, notifyUpdate]);

  const formatData = () => {
    return {
      attributes: {
        notificationPreferencesByKind: preferences
      }
    };
  };

  const errors = actionData?.errors || [];

  return (
    <>
      <HeadContent title={t("titles.notifications")} appendDefaultTitle />
      <section className="bg-neutral05">
        <div className="container">
          <Styled.Form
            submit={submit}
            errors={errors}
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
