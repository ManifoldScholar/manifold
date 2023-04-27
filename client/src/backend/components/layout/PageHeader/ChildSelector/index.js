import React from "react";
import DisclosureNavigationMenu from "global/components/atomic/DisclosureNavigationMenu";
import MenuBody from "./MenuBody";
import Button from "./Button";
import * as Styled from "./styles";

export default function ChildSelector({ links, active, entity }) {
  return links ? (
    <Styled.Positioner>
      <DisclosureNavigationMenu
        disclosure={<Button active={active} entity={entity} />}
      >
        <MenuBody links={links} />
      </DisclosureNavigationMenu>
    </Styled.Positioner>
  ) : null;
}
