import React, { Fragment } from "react";
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
            {hk.keys.map((k, i) => (
              /* eslint-disable react/no-array-index-key */
              <Fragment key={`${k}_${i}`}>
                <Styled.Key>{k}</Styled.Key>
                {hk.inline && i === 0 && (
                  <Styled.TextPlaceholder>[text]</Styled.TextPlaceholder>
                )}
              </Fragment>
            ))}
          </Styled.Keys>
        </Styled.HotKey>
      ))}
    </Styled.Wrapper>
  );
}
