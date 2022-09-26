import React from "react";
import * as Styled from "./styles";

export default function BaseLabel({
  id,
  as = "label",
  label,
  styleType = "primary",
  hasInstructions = false,
  isSelect = false,
  className
}) {
  /* eslint-disable no-nested-ternary */
  const Label =
    styleType === "primary"
      ? Styled.PrimaryLabel
      : styleType === "secondary"
      ? Styled.SecondaryLabel
      : Styled.TertiaryLabel;

  return (
    <Label
      as={as}
      htmlFor={id}
      $hasInstructions={hasInstructions}
      $isSelect={isSelect}
      className={className}
    >
      {label}
    </Label>
  );
}

BaseLabel.displayName = "Form.BaseLabel";
