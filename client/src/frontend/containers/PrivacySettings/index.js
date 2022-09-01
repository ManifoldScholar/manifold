import React from "react";
import Authorize from "hoc/Authorize";
import lh from "helpers/linkHandler";
import { useTranslation } from "react-i18next";
import AccountData from "frontend/components/privacy/AccountData";
import CookiesForm from "frontend/components/privacy/CookiesForm";

export default function PrivacySettingsContainer() {
  const { t } = useTranslation();

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
      <div className="container">
        <div className="subscriptions">
          <h1 className="form-heading">
            {t("forms.privacy.title")}
            <span className="instructions">
              {t("forms.privacy.instructions")}
            </span>
          </h1>
          <CookiesForm />
          <AccountData />
        </div>
      </div>
    </Authorize>
  );
}
