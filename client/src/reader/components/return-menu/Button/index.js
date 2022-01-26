import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

export default function ReturnMenuButton({ toggleReaderMenu, expanded }) {
  const onClick = e => {
    e.stopPropagation();
    toggleReaderMenu();
  };

  return (
    <Styled.Button
      onClick={onClick}
      data-id="toggle-menu"
      aria-haspopup
      aria-expanded={expanded}
      $expanded={expanded}
    >
      Menu
    </Styled.Button>
  );
}

ReturnMenuButton.displayName = "ReturnMenuButton";

ReturnMenuButton.propTypes = {
  toggleReaderMenu: PropTypes.func.isRequired,
  expanded: PropTypes.bool
};
