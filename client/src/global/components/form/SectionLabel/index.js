import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

function SectionLabel({
  label,
  as = "header",
  headingAs = "h2",
  id,
  color = "default"
}) {
  const HTag = headingAs;

  return (
    <Styled.Label as={as} $color={color}>
      <HTag id={id}>{label}</HTag>
    </Styled.Label>
  );
}

SectionLabel.displayName = "Form.SectionLabel";

SectionLabel.propTypes = {
  label: PropTypes.string.isRequired,
  as: PropTypes.string,
  headingAs: PropTypes.string,
  id: PropTypes.string,
  color: PropTypes.oneOf(["default", "error"])
};

export default SectionLabel;
