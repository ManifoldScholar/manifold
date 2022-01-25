import React, { useState } from "react";
import PropTypes from "prop-types";
import Collecting from "frontend/components/collecting";
import * as Styled from "./styles";

function TocNode({ node, onClick, linkTo, active, children }) {
  const [hovering, setHovering] = useState(false);

  return (
    <li>
      <Styled.Inner>
        <Styled.ItemLink
          to={linkTo}
          onClick={onClick}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocus={() => setHovering(true)}
          onBlur={() => setHovering(false)}
          data-id="hide-drawer"
          $active={active || hovering}
        >
          {node.label}
        </Styled.ItemLink>
        <Styled.Toggle
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocus={() => setHovering(true)}
          onBlur={() => setHovering(false)}
        >
          <Collecting.Toggle
            collectable={{
              id: node.id,
              type: "textSections",
              label: node.label
            }}
            outlined={false}
            onDialogOpen={() => setHovering(true)}
            onDialogClose={() => setHovering(false)}
            hiddenIfUncollected={!hovering}
          />
        </Styled.Toggle>
      </Styled.Inner>
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
