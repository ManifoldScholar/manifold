import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

function ActionBox({ title, instructions, actions }) {
  return (
    <Styled.ActionBox>
      <Styled.Heading>
        <Styled.Title>{title}</Styled.Title>
        <Styled.Instructions>{instructions}</Styled.Instructions>
      </Styled.Heading>
      <div>{actions}</div>
    </Styled.ActionBox>
  );
}

ActionBox.displayName = "ReadingGroup.ActionBox";

ActionBox.propTypes = {
  title: PropTypes.string.isRequired,
  instructions: PropTypes.string.isRequired,
  actions: PropTypes.node.isRequired
};

export default ActionBox;
