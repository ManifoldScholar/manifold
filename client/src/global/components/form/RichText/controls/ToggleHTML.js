import React from "react";
import Utility from "global/components/utility";
import * as Styled from "./styles";

export default function HTMLToggle({ active, onClick }) {
  const icon = active ? "codeOff16" : "code16";
  return (
    <Styled.HTMLToggle className="button-secondary--outlined" onClick={onClick}>
      {icon && <Utility.IconComposer icon={icon} />}
    </Styled.HTMLToggle>
  );
}
