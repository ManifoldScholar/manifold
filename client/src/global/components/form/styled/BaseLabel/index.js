import React from "react";
import * as Styled from "./styles";

export default function BaseLabel({
  id,
  label,
  styleType = "primary",
  hasInstructions = false,
  isSelect = false
}) {
  /* eslint-disable no-nested-ternary */
  const Label =
    styleType === "primary"
      ? Styled.PrimaryLabel
      : styleType === "secondary"
      ? Styled.SecondaryLabel
      : Styled.TertiaryLabel;

  return (
    <Label htmlFor={id} $hasInstructions={hasInstructions} $isSelect={isSelect}>
      {label}
    </Label>
  );
}

BaseLabel.displayName = "Form.BaseLabel";
