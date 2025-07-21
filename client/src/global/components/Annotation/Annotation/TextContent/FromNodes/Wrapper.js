import React from "react";
import Collapse from "global/components/Collapse";
import * as Styled from "./styles";

export default function FromNodesWrapper({ children, overlayLight }) {
  return (
    <Collapse stubHeight={200}>
      <Styled.Toggle>
        <Styled.Content>
          {children}
          <Styled.Overlay $light={overlayLight} />
        </Styled.Content>
      </Styled.Toggle>
    </Collapse>
  );
}
