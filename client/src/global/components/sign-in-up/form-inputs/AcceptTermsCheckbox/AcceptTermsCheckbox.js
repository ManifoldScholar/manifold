import React from "react";
import { useUID } from "react-uid";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

export default function AcceptCheckbox({ label, onChange }) {
  const uid = useUID();

  return (
    <Styled.Wrapper htmlFor={uid}>
      <input
        id={uid}
        type="checkbox"
        onChange={onChange}
        className="screen-reader-text"
      />
      <Styled.Checkbox>
        <IconComposer icon="checkmark16" size={16} />
      </Styled.Checkbox>
      <Styled.Label>{label}</Styled.Label>
    </Styled.Wrapper>
  );
}
