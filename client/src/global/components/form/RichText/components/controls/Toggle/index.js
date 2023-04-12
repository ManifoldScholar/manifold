import React from "react";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

export default function Toggle({ options }) {
  const [left, right] = options;
  return (
    <Styled.Wrapper>
      <Styled.Button $active={left.active} onClick={left.onClick}>
        <IconComposer
          icon="code16"
          size={16}
          className="button-icon-secondary__icon button-icon-secondary__icon--large"
        />
        <span>{left.label}</span>
      </Styled.Button>
      <Styled.Button $active={right.active} onClick={right.onClick}>
        <IconComposer
          icon="code16"
          size={16}
          className="button-icon-secondary__icon button-icon-secondary__icon--large"
        />
        <span>{right.label}</span>
      </Styled.Button>
    </Styled.Wrapper>
  );
}
