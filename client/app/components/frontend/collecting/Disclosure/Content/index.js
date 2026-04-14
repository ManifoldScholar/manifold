import * as React from "react";
import { useDisclosureContext } from "../context";
import * as Styled from "./styles";

export default function Content({ children, className }) {
  const {
    contentProps,
    toggleProps: { onClick: closeMenu }
  } = useDisclosureContext();

  return (
    <Styled.Content {...contentProps} className={className}>
      {children({ closeMenu })}
    </Styled.Content>
  );
}

Content.displayName = "Disclosure.Content";
