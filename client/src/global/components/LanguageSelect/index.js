import React, { useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { updateI18n } from "utils/i18n";

function LanguageSelect({ authentication, language }) {
  const { t } = useTranslation();
  const userLanguage =
    authentication?.currentUser?.attributes?.persistentUi?.reader?.locale
      ?.language;

  const initialLanguage = userLanguage || language;
  const [lang, setLang] = useState(initialLanguage);

  const dispatch = useDispatch();
  const updateLanguage = useCallback(
    lang => {
      dispatch({
        type: "SET_LOCALE",
        payload: { locale: { language: lang } }
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
    <fieldset className="c-language-select">
      <label htmlFor="langSelect" className="a-hidden">
        {t("localize-content")}
      </label>
      <select
        name="langSelect"
        id="langSelect"
        value={lang}
        onChange={handleChange}
      >
        <option value="none">Select language:</option>
        <option value="en">{t(`english-site-name`)}</option>
        <option value="es">{t(`espanol-site-name`)}</option>
        <option value="nl">{t(`dutch-site-name`)}</option>
      </select>
    </fieldset>
  );
}

LanguageSelect.mapStateToProps = state => {
  return {
    authentication: state.authentication,
    language: state.ui.persistent.reader.locale.language
  };
};

LanguageSelect.displayName = "Global.LanguageSelect";
export default connect(LanguageSelect.mapStateToProps)(LanguageSelect);
