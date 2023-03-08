import React from "react";
import Collapse from "global/components/Collapse";
import * as Styled from "./styles";

export default function FromNodesWrapper({ children }) {
  return (
    <Collapse>
      <Styled.Toggle>
        <Styled.Content stubHeight={200}>
          {children}
          <Styled.Overlay />
        </Styled.Content>
      </Styled.Toggle>
    </Collapse>
  );
}
