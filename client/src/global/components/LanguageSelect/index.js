import React, { useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { updateI18n } from "utils/i18n";
import { Select } from "global/components/atomic/form";

function LanguageSelect({ authentication, language }) {
  const { t } = useTranslation();
  const userLanguage =
    authentication?.currentUser?.attributes?.persistentUi?.locale?.language;

  const initialLanguage = userLanguage || language;
  const [lang, setLang] = useState(initialLanguage);

  const dispatch = useDispatch();
  const updateLanguage = useCallback(
    l => {
      dispatch({
        type: "SET_LOCALE",
        payload: { language: l }
      });
    },
    [dispatch]
  );

  const handleChange = event => {
    const newLang = event.target?.value || "en";
    setLang(newLang);
    // dispatch
    updateLanguage(newLang);
    // and update the I18n
    updateI18n(newLang);
  };

  useEffect(() => {
    setLang(initialLanguage);
    updateI18n(initialLanguage);
  }, [initialLanguage]);

  return (
    <Select
      label={t("localize-content")}
      value={lang}
      options={[
        {
          value: "en",
          label: t(`locales.en`)
        },
        {
          value: "es",
          label: t(`locales.es`)
        },
        {
          value: "nl",
          label: t(`locales.nl`)
        }
      ]}
      onChange={handleChange}
      preIcon="languageGlobe24"
    />
  );
}

LanguageSelect.mapStateToProps = state => {
  return {
    authentication: state.authentication,
    language: state.ui.persistent.locale.language
  };
};

LanguageSelect.displayName = "Global.LanguageSelect";
export default connect(LanguageSelect.mapStateToProps)(LanguageSelect);
