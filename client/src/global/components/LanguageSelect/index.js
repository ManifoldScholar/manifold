import React, { useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { updateI18n } from "utils/i18n";
import UniqueIcons from "global/components/icon/unique";
import Utility from "global/components/utility";

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
        <option value="none">Language:</option>
        <option value="en">{t(`english-site-name`)}</option>
        <option value="es">{t(`espanol-site-name`)}</option>
        <option value="nl">{t(`dutch-site-name`)}</option>
      </select>
      <UniqueIcons.GlobeUnique />
      <Utility.IconComposer icon="disclosureDown24" />
    </fieldset>
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
