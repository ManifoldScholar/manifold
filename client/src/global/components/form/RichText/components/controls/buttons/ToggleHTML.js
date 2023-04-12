import React from "react";
import Utility from "global/components/utility";
import * as Styled from "./styles";

export default function HTMLToggle({ active, onClick }) {
  const icon = active ? "codeOff16" : "code16";
  const label = active ? "Switch to rich text editor" : "Switch to html editor";
  return (
    <Styled.HTMLToggle
      aria-label={label}
      className="button-secondary--outlined"
      onClick={onClick}
    >
      {icon && <Utility.IconComposer icon={icon} />}
    </Styled.HTMLToggle>
  );
}
