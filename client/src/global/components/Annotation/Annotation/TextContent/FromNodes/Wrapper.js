import React from "react";
import Collapse from "global/components/Collapse";
import * as Styled from "./styles";

export default function FromNodesWrapper({ children, overlayLight }) {
  return (
    <Collapse>
      <Styled.Toggle>
        <Styled.Content stubHeight={200}>
          {children}
          <Styled.Overlay $light={overlayLight} />
        </Styled.Content>
      </Styled.Toggle>
    </Collapse>
  );
}
