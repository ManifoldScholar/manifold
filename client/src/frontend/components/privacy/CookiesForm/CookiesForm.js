import React from "react";
import { useTranslation } from "react-i18next";
import { meAPI } from "api";
import humps from "humps";
import RadioGroup from "./RadioGroup";
import BaseHookForm from "global/components/sign-in-up/BaseHookForm";
import { useFromStore, useNotification } from "hooks";
import * as Styled from "./styles";

export default function CookiesForm() {
  const { t } = useTranslation();

  const { currentUser } = useFromStore("authentication") ?? {};

  const { internalAnalytics, googleAnalytics } = currentUser.attributes ?? {};

  const defaultValues = {
    internalAnalytics: internalAnalytics.toString(),
    googleAnalytics: googleAnalytics.toString()
  };

  const formatAttributes = data =>
    Object.keys(data)
      .map(d => [d, data[d] === "true"])
      .reduce((obj, d) => ({ ...obj, [d[0]]: d[1] }), {});

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

  return (
    <Styled.Wrapper>
      <Styled.Header>{t("forms.privacy.cookies")}</Styled.Header>
      <BaseHookForm
        apiMethod={meAPI.update}
        defaultValues={defaultValues}
        formatData={formatAttributes}
        onSuccess={notifyUpdate}
      >
        {() => (
          <>
            <Styled.Group>
              <RadioGroup
                setting={{
                  key: "internalAnalytics",
                  label: getLocalized("internalAnalytics", "label"),
                  instructions: getLocalized("internalAnalytics", "description")
                }}
                options={{ false: t("common.no"), true: t("common.yes") }}
              />
              <RadioGroup
                setting={{
                  key: "googleAnalytics",
                  label: getLocalized("googleAnalytics", "label"),
                  instructions: getLocalized("googleAnalytics", "description")
                }}
                options={{ false: t("common.no"), true: t("common.yes") }}
              />
            </Styled.Group>
            <Styled.Button
              type="submit"
              label="forms.notifications.submit_label"
            />
          </>
        )}
      </BaseHookForm>
    </Styled.Wrapper>
  );
}
