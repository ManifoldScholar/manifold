import * as React from "react";
import DisclosureContext from "./context";
import useDisclosure from "./hook";
import * as Styled from "./styles";

export default function Provider({ children, initOpen }) {
  const value = useDisclosure(initOpen);

  return (
    <DisclosureContext.Provider value={value}>
      <Styled.Wrapper>{children}</Styled.Wrapper>
    </DisclosureContext.Provider>
  );
}

Provider.displayName = "Disclosure.Provider";
