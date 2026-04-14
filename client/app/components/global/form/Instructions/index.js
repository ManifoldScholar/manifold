import { useContext } from "react";
import PropTypes from "prop-types";
import { FormContext } from "helpers/contexts";
import * as Styled from "./styles";

export default function Instructions({
  instructions = null,
  className,
  id,
  withActions
}) {
  const context = useContext(FormContext);

  const InstructionsComponent =
    context?.styleType === "secondary"
      ? Styled.SecondaryInstructions
      : Styled.PrimaryInstructions;

  return (
    <InstructionsComponent
      className={className}
      $withActions={withActions}
      id={id}
    >
      {instructions}
    </InstructionsComponent>
  );
}

Instructions.propTypes = {
  instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.string,
  id: PropTypes.string,
  withActions: PropTypes.bool
};
