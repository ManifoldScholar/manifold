import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

function SectionLabel({ label, as = "header", id }) {
  return (
    <Styled.Label as={as}>
      <h2 id={id}>{label}</h2>
    </Styled.Label>
  );
}

SectionLabel.displayName = "Form.SectionLabel";

SectionLabel.propTypes = {
  label: PropTypes.string.isRequired,
  as: PropTypes.string,
  id: PropTypes.string,
  secondary: PropTypes.bool
};

export default SectionLabel;
