import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

function Panel({
  label,
  heading,
  instructions,
  children,
  onProceed,
  onCancel
}) {
  const { t } = useTranslation();

  return (
    <Styled.Form onSubmit={onProceed}>
      <Styled.Label>{label}</Styled.Label>
      <Styled.Heading>{heading}</Styled.Heading>
      <Styled.Instructions>{instructions}</Styled.Instructions>
      {children}
      <Styled.Actions>
        <button type="submit" className="button-secondary">
          {label}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="button-secondary button-secondary--dull"
        >
          {t("actions.cancel")}
        </button>
      </Styled.Actions>
    </Styled.Form>
  );
}

Panel.displayName = "ReadingGroup.Settings.Panel";

Panel.propTypes = {
  label: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  instructions: PropTypes.string.isRequired,
  children: PropTypes.node,
  onProceed: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default Panel;
