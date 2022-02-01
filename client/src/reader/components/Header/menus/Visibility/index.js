import React from "react";
import { useMenuState } from "reakit/Menu";
import PropTypes from "prop-types";
import * as Styled from "./styles";

export default function Visibility() {
  const menu = useMenuState();

  return (
    <>
      <Styled.Button {...menu}>Menu</Styled.Button>
      <Styled.MenuBody {...menu} aria-label="Site Navigation"></Styled.MenuBody>
    </>
  );
}
