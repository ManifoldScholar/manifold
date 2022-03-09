import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import humps from "humps";
import isString from "lodash/isString";
import * as Styled from "./styles";

export default function Item({ label, value, children }) {
  const { t } = useTranslation();

  const renderValue = () => {
    if (!children)
      return <Styled.Value dangerouslySetInnerHTML={{ __html: value }} />;

    const childEl = isString(children.type)
      ? children
      : React.cloneElement(children);
    return <Styled.Value>{childEl}</Styled.Value>;
  };

  // TODO: Add documentation re: how l10n works here.
  const renderLabel = () => {
    if (!label) return null;
    const i18nKey = humps.decamelize(label, { separator: "_" }).toLowerCase();
    return <Styled.Label>{t(`metadata.${i18nKey}`)}</Styled.Label>;
  };

  return (
    <>
      {renderLabel()}
      {renderValue()}
    </>
  );
}

Item.displayName = "Meta.Item";

Item.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
};
