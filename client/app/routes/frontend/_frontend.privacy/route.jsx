import { useTranslation } from "react-i18next";
import { useSubmit } from "react-router";
import requireLogin from "app/routes/utility/loaders/requireLogin";
import { meAPI } from "api";
import { getApiClient } from "app/routes/utility/helpers/getApiClient";
import AccountData from "frontend/components/privacy/AccountData";
import CookiesForm from "frontend/components/privacy/CookiesForm";
import Form from "global/components/form";
import HeadContent from "global/components/HeadContent";
import * as Styled from "./styles";

export const loader = async ({ request, context }) => {
  requireLogin(request, context);
  return null;
};

export async function action({ request, context }) {
  const formData = await request.formData();
  const data = JSON.parse(formData.get("data") ?? "");
  const client = getApiClient(context);

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
          detail: error.message || "Failed to update preferences",
          source: { pointer: "/data" }
        }
      ]
    };
  }
}

export default function PrivacyRoute({ actionData }) {
  const { t } = useTranslation();
  const submit = useSubmit();
  const errors = actionData?.errors || [];

  return (
    <>
      <HeadContent title={t("titles.privacy")} appendDefaultTitle />
      <section className="bg-neutral05">
        <div className="container">
          <Styled.FormWrapper>
            <div>
              <Form.Header
                label={t("forms.privacy.title")}
                instructions={t("forms.privacy.instructions")}
                styleType="primary"
              />
              <Styled.Link to="/data-use">
                What data does Manifold store about me?
              </Styled.Link>
            </div>
            <CookiesForm
              submit={submit}
              errors={errors}
              actionData={actionData}
            />
            <AccountData />
          </Styled.FormWrapper>
        </div>
      </section>
    </>
  );
}
