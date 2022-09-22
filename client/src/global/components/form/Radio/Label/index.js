import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

export default function FormRadioLabel({ label, prompt }) {
  return (
    <Styled.Legend>
      {label && <Styled.Title aria-hidden>{label}</Styled.Title>}
      {prompt && <Styled.Prompt>{prompt}</Styled.Prompt>}
    </Styled.Legend>
  );
}

FormRadioLabel.displayName = "Form.Radio.Label";

FormRadioLabel.propTypes = {
  label: PropTypes.string.isRequired,
  prompt: PropTypes.string
};
