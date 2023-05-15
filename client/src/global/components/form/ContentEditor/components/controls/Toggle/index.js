import React from "react";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

export default function Toggle({ options, padding = "20px" }) {
  const [left, right] = options;

  return (
    <Styled.Wrapper>
      <Styled.Button
        $active={left.active}
        $padding={padding}
        onClick={left.onClick}
      >
        <IconComposer
          icon={left.icon || "code16"}
          size={left.iconSize || 16}
          className="button-icon-secondary__icon button-icon-secondary__icon--large"
        />
        {left.mobileLabel && (
          <Styled.MobileLabel>{left.mobileLabel}</Styled.MobileLabel>
        )}
        <Styled.Label>{left.label}</Styled.Label>
      </Styled.Button>
      <Styled.Button
        $active={right.active}
        $padding={padding}
        onClick={right.onClick}
      >
        <IconComposer
          icon={right.icon || "code16"}
          size={right.iconSize || 16}
          className="button-icon-secondary__icon button-icon-secondary__icon--large"
        />
        {right.mobileLabel && (
          <Styled.MobileLabel>{right.mobileLabel}</Styled.MobileLabel>
        )}
        <Styled.Label>{right.label}</Styled.Label>
      </Styled.Button>
    </Styled.Wrapper>
  );
}
