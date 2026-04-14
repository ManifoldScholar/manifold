import React from "react";
import DisclosureNavigationMenu from "global/components/atomic/DisclosureNavigationMenu";
import MenuBody from "./MenuBody";
import Button from "./Button";
import * as Styled from "./styles";

export default function ActionSelector({ actions, entity }) {
  return actions ? (
    <Styled.Positioner>
      <DisclosureNavigationMenu disclosure={<Button />}>
        <MenuBody actions={actions} entity={entity} />
      </DisclosureNavigationMenu>
    </Styled.Positioner>
  ) : null;
}
