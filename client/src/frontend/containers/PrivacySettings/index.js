import { Navigate } from "react-router-dom";
import lh from "helpers/linkHandler";
import { useTranslation } from "react-i18next";
import AccountData from "frontend/components/privacy/AccountData";
import CookiesForm from "frontend/components/privacy/CookiesForm";
import Form from "global/components/form";
import HeadContent from "global/components/HeadContent";
import { useCurrentUser } from "hooks";
import * as Styled from "./styles";

export default function PrivacySettingsContainer() {
  const { t } = useTranslation();
  const currentUser = useCurrentUser();

  if (!currentUser)
    return (
      <Navigate
        to={lh.link("frontendLogin")}
        search={{ redirect_uri: "/privacy" }}
      />
    );

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
              <Styled.Link to={lh.link("dataUse")}>
                What data does Manifold store about me?
              </Styled.Link>
            </div>
            <CookiesForm />
            <AccountData />
          </Styled.FormWrapper>
        </div>
      </section>
    </>
  );
}

PrivacySettingsContainer.displayName = "Frontend.Containers.PrivacySettings";
