import React from "react";
import * as Styled from "./styles";

export default function TooltipContent({ label, description, hotkeys = [] }) {
  return (
    <Styled.Wrapper>
      <Styled.Header>
        <Styled.Label>{label}</Styled.Label>
        {description && <Styled.Description>{description}</Styled.Description>}
      </Styled.Header>
      {hotkeys.map(hk => (
        <Styled.HotKey key={hk.label}>
          <Styled.HotKeyLabel>{hk.label}</Styled.HotKeyLabel>
          <Styled.Keys>
            {hk.keys.map(k => (
              <Styled.Key key={k}>{k}</Styled.Key>
            ))}
          </Styled.Keys>
        </Styled.HotKey>
      ))}
    </Styled.Wrapper>
  );
}
