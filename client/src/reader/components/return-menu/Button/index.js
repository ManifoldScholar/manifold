import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";
import { useTranslation } from "react-i18next";

export default function ReturnMenuButton({ toggleReaderMenu, expanded }) {
  const onClick = e => {
    e.stopPropagation();
    toggleReaderMenu();
  };
  const { t } = useTranslation();

  return (
    <Styled.Button
      onClick={onClick}
      data-id="toggle-menu"
      aria-haspopup
      aria-expanded={expanded}
      $expanded={expanded}
    >
      {t("navigation.menu")}
    </Styled.Button>
  );
}

ReturnMenuButton.displayName = "ReturnMenuButton";

ReturnMenuButton.propTypes = {
  toggleReaderMenu: PropTypes.func.isRequired,
  expanded: PropTypes.bool
};
