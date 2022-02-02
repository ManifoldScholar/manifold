import React, { useState } from "react";
import { MenuItem } from "reakit/Menu";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Collecting from "frontend/components/collecting";
import * as Styled from "./styles";

function TocNode({ node, linkTo, active, children, menu }) {
  const [showAsActive, setShowAsActive] = useState(false);

  return (
    <li>
      <Styled.Content
        $active={active || showAsActive}
        onMouseEnter={() => setShowAsActive(true)}
        onMouseLeave={() => setShowAsActive(false)}
      >
        <Styled.Label as={Link} to={linkTo} {...menu}>
          {node.label}
        </Styled.Label>
        <Styled.ToggleWrapper>
          <Collecting.Toggle
            menu={menu}
            collectable={{
              id: node.id,
              type: "textSections",
              label: node.label
            }}
            outlined={false}
            onDialogOpen={() => setShowAsActive(true)}
            onDialogClose={() => setShowAsActive(false)}
            hiddenIfUncollected={!showAsActive}
          />
        </Styled.ToggleWrapper>
      </Styled.Content>
      {children}
    </li>
  );
}

TocNode.displayName = "Toc.Item";

TocNode.propTypes = {
  node: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  linkTo: PropTypes.string.isRequired,
  active: PropTypes.bool,
  children: PropTypes.node
};

export default TocNode;
