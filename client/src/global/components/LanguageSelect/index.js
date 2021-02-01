import React, { useState, useCallback } from "react";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { updateI18n } from "utils/i18n";

function LanguageSelect({ language }) {
  const { t } = useTranslation();
  const currentLanguage = language;
  // const currentLanguage = "en";
  const [toEs, setToEs] = useState(currentLanguage !== "en");

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

  const handleChange = ({ target: { checked } }) => {
    setToEs(checked);
    const newLang = checked ? "es" : "en";
    // dispatch
    updateLanguage(newLang);
    // update translation library
    updateI18n(newLang);
  };

  return (
    <fieldset className="c-language-select">
      <legend className="a-hidden">{t("localize-content")}</legend>
      <div className="c-language-select__inner">
        <span className="c-language-select__tag">Language</span>
        <div className="c-language-select__switch">
          <input
            className="c-language-select__input"
            type="checkbox"
            name="langSelect"
            id="langSelect"
            onChange={handleChange}
          />
          <label className="c-language-select__label" htmlFor="langSelect">
            <span
              className={classNames({
                inner: true,
                es: toEs
              })}
            />
            <span
              className={classNames({
                switch: true,
                es: toEs
              })}
            />
          </label>
        </div>
      </div>
    </fieldset>
  );
}

LanguageSelect.mapStateToProps = state => {
  return {
    language: state.ui.persistent.reader.locale.language
  };
};

LanguageSelect.displayName = "Global.LanguageSelect";
export default connect(LanguageSelect.mapStateToProps)(LanguageSelect);
