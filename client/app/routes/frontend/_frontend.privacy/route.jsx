import { useTranslation } from "react-i18next";
import { useSubmit } from "react-router";
import requireLogin from "app/routes/utility/loaders/requireLogin";
import { meAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
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
  const data = await request.json();

  try {
    const result = await queryApi(meAPI.update(data.attributes), context);

    if (result?.errors) {
      return { errors: result.errors };
    }

    return { success: true };
  } catch (error) {
    return handleActionError(error, "Failed to update preferences");
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
