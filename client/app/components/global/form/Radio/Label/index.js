import PropTypes from "prop-types";
import * as Styled from "./styles";

export default function FormRadioLabel({ label, prompt }) {
  if (!label && !prompt) return null;

  return (
    <Styled.Legend>
      {label && <Styled.Title aria-hidden>{label}</Styled.Title>}
      {prompt && <Styled.Prompt>{prompt}</Styled.Prompt>}
    </Styled.Legend>
  );
}

FormRadioLabel.displayName = "Form.Radio.Label";

FormRadioLabel.propTypes = {
  label: PropTypes.string,
  prompt: PropTypes.string
};
