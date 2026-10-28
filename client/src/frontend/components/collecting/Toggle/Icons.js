import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

function Icons({ useOutline }) {
  return (
    <Styled.Icons aria-hidden="true">
      <Styled.Icon icon="MinusUnique" size={28} $type="remove" />
      <Styled.Icon icon="CheckUnique" size={28} $type="confirm" />
      {!useOutline && (
        <Styled.Icon icon="StarFillUnique" size="default" $type="add" />
      )}
      {useOutline && (
        <Styled.Icon icon="StarOutlineUnique" size="default" $type="add" />
      )}
    </Styled.Icons>
  );
}

Icons.displayName = "Collecting.Toggle.Icons";

Icons.propTypes = {
  useOutline: PropTypes.bool
};

export default Icons;
