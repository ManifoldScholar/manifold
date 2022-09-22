import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

function FieldWrapper({ children, as = "div", className }) {
  return (
    <Styled.Wrapper as={as} className={className}>
      {children}
    </Styled.Wrapper>
  );
}

FieldWrapper.displayName = "Form.FieldWrapper";

FieldWrapper.propTypes = {
  children: PropTypes.node.isRequired
};

export default FieldWrapper;
