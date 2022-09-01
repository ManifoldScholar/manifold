import React from "react";
import { useTranslation } from "react-i18next";
import humps from "humps";
import RadioGroup from "global/components/preferences/NotificationsForm/RadioGroup";

export default function CookiesForm() {
  const { t } = useTranslation();

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

  const cookieTypes = [
    "necessaryCookies",
    "internalAnalytics",
    "googleAnalytics"
  ];

  return (
    <div style={{ marginBlockEnd: "75px" }}>
      <h2 className="section-heading-secondary">
        {t("forms.privacy.cookies")}
      </h2>
      <div className="form-group">
        {cookieTypes.map(type => (
          <RadioGroup
            key={type}
            preference={{
              key: type,
              label: getLocalized(type, "label"),
              instructions: getLocalized(type, "description")
            }}
            options={
              type === "necessaryCookies"
                ? { always: "Always Active" }
                : undefined
            }
            value="always"
          />
        ))}
      </div>
      <div className="row-1-p">
        <div className="form-input form-error">
          <input
            className="button-secondary"
            style={{ width: "45%" }}
            type="submit"
            value={t("forms.notifications.submit_label")}
          />
        </div>
      </div>
    </div>
  );
}
