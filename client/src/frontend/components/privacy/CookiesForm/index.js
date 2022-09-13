import React from "react";
import { useTranslation } from "react-i18next";
import { meAPI } from "api";
import humps from "humps";
import RadioGroup from "global/components/form/hook-form/RadioGroup";
import BaseHookForm from "global/components/form/hook-form/BaseHookForm";
import { useFromStore, useNotification } from "hooks";
import { useUID } from "react-uid";
import * as Styled from "./styles";

export default function CookiesForm() {
  const { t } = useTranslation();

  const settings = useFromStore("settings", "select");
  const manifoldAnalyticsEnabled = !settings?.attributes?.general
    ?.disableInternalAnalytics;
  const googleAnalyticsEnabled = !!settings?.attributes?.integrations
    ?.gaTrackingId;
  const installationName = settings?.attributes?.general?.installationName;

  const { currentUser } = useFromStore("authentication") ?? {};

  const { consentManifoldAnalytics, consentGoogleAnalytics } =
    currentUser.attributes ?? {};

  const defaultValues = {
    manifold: consentManifoldAnalytics?.toString() ?? "true",
    google: consentGoogleAnalytics?.toString() ?? "true"
  };

  const formatAttributes = data => ({
    consentManifoldAnalytics: !manifoldAnalyticsEnabled
      ? null
      : data.manifold === "true",
    consentGoogleAnalytics: !googleAnalyticsEnabled
      ? null
      : data.google === "true"
  });

  const notifyUpdate = useNotification(() => ({
    level: 0,
    id: `CURRENT_USER_UPDATED`,
    heading: t("forms.signin_overlay.update_notification_header"),
    expiration: 3000
  }));

  const getLocalized = (prop, strType) => {
    const i18nKey = humps.decamelize(prop, { separator: "_" }).toLowerCase();

    switch (strType) {
      case "label":
        return t(`forms.privacy.${i18nKey}.label`);
      case "description":
        return t(`forms.privacy.${i18nKey}.description`, { defaultValue: "" });
      default:
        return "";
    }
  };

  const showNoCookiesMessage = !(
    manifoldAnalyticsEnabled || googleAnalyticsEnabled
  );

  const uid = useUID();

  return (
    <Styled.FormSection role="group" aria-labelledby={`${uid}-header`}>
      <Styled.Header id={`${uid}-header`}>
        {t("forms.privacy.cookies")}
      </Styled.Header>
      {showNoCookiesMessage ? (
        <Styled.FormFields>
          <Styled.NoAnalyticsMessage>
            {t("forms.privacy.no_analytics_message", {
              name: installationName
            })}
          </Styled.NoAnalyticsMessage>
        </Styled.FormFields>
      ) : (
        <BaseHookForm
          apiMethod={meAPI.update}
          defaultValues={defaultValues}
          formatData={formatAttributes}
          onSuccess={notifyUpdate}
        >
          {() => (
            <>
              <Styled.FormFields>
                {manifoldAnalyticsEnabled && (
                  <RadioGroup
                    setting={{
                      key: "manifold",
                      label: getLocalized("internalAnalytics", "label"),
                      instructions: getLocalized(
                        "internalAnalytics",
                        "description"
                      )
                    }}
                    options={{ false: t("common.no"), true: t("common.yes") }}
                  />
                )}
                {googleAnalyticsEnabled && (
                  <RadioGroup
                    setting={{
                      key: "google",
                      label: getLocalized("googleAnalytics", "label"),
                      instructions: getLocalized(
                        "googleAnalytics",
                        "description"
                      )
                    }}
                    options={{ false: t("common.no"), true: t("common.yes") }}
                  />
                )}
              </Styled.FormFields>
              <Styled.Button
                type="submit"
                label="forms.notifications.submit_label"
              />
            </>
          )}
        </BaseHookForm>
      )}
    </Styled.FormSection>
  );
}

CookiesForm.displayName = "Frontend.Privacy.CookiesForm";
