import React from "react";
import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";
// react-i18next extends i18next's functionality
// params in this context are values passed into the translation key
// For docs on pluralization, see: https://www.i18next.com/translation-function/plurals
// USAGE:
/* <T i18nKey="userMessagesUnread" count={count}>
  Hello <strong title={t('nameTitle')}>{{name}}</strong>, you have {{count}} unread message. <Link to="/msgs">Go to messages</Link>.
</T> */
// HERE IS WHAT THE en.json looks like
// "userMessagesUnread": "Hello <1>{{name}}</1>, you have {{count}} unread message. <2>Go to message</2>.",
// "userMessagesUnread_plural": "Hello <1>{{name}}</1>, you have {{count}} unread messages.  <2>Go to messages</2>.",
// SEE: https://react.i18next.com/legacy-v9/trans-component

const T = ({ children, components, i18nKey, translate, values }) => {
  const { t } = useTranslation();

  if (i18nKey) {
    return (
      <Trans i18nKey={i18nKey} components={components} values={values}>
        {children}
      </Trans>
    );
  } else if (translate) {
    return t(translate, { ...values });
  }

  return <></>;
};

T.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
    PropTypes.array
  ]),
  components: PropTypes.object,
  translate: PropTypes.string,
  i18nKey: PropTypes.string,
  params: PropTypes.object,
  values: PropTypes.object
};

export default T;
