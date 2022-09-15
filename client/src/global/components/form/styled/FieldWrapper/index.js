import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

function FieldWrapper({ children }) {
  return (
    <Styled.Wrapper>
      {children}
    </Styled.Wrapper>
  )
}

FieldWrapper.displayName = "Form.FieldWrapper";

FieldWrapper.propTypes = {
  children: PropTypes.node.isRequired
}

export default FieldWrapper;
