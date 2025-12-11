import { useTranslation } from "react-i18next";
import { useSubmit } from "react-router";
import requireLogin from "lib/react-router/loaders/requireLogin";
import { meAPI } from "api";
import formAction from "lib/react-router/helpers/formAction";
import AccountData from "components/frontend/privacy/AccountData";
import CookiesForm from "components/frontend/privacy/CookiesForm";
import Form from "components/global/form";
import HeadContent from "components/global/HeadContent";
import * as Styled from "./styles";

export const loader = async ({ request, context }) => {
  requireLogin(request, context);
  return null;
};

export const action = formAction({
  mutation: ({ data }) => meAPI.update(data.attributes)
});

export default function PrivacyRoute({ actionData }) {
  const { t } = useTranslation();
  const submit = useSubmit();

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
              errors={actionData?.errors || []}
              actionData={actionData}
            />
            <AccountData />
          </Styled.FormWrapper>
        </div>
      </section>
    </>
  );
}
