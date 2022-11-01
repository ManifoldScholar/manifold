import React from "react";
import Authorize from "hoc/Authorize";
import lh from "helpers/linkHandler";
import { useTranslation } from "react-i18next";
import AccountData from "frontend/components/privacy/AccountData";
import CookiesForm from "frontend/components/privacy/CookiesForm";
import * as Styled from "./styles";

export default function PrivacySettingsContainer() {
  const { t } = useTranslation();

  return (
    <Authorize
      kind="any"
      failureRedirect={lh.link("frontendLogin")}
      failureNotification={{
        heading: t("errors.unauthorized.heading"),
        body: t("errors.unauthorized.privacy_body"),
        level: 2
      }}
    >
      <section className="bg-neutral05">
        <Styled.Container>
          <Styled.FormWrapper>
            <Styled.Heading>
              {t("forms.privacy.title")}
              <Styled.Instructions>
                {t("forms.privacy.instructions")}
              </Styled.Instructions>
            </Styled.Heading>
            <CookiesForm />
            <AccountData />
          </Styled.FormWrapper>
        </Styled.Container>
      </section>
    </Authorize>
  );
}

PrivacySettingsContainer.displayName = "Frontend.Containers.PrivacySettings";
