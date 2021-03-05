import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";
import Collecting from "frontend/components/collecting";

function TocNode({ node, onClick, linkTo, active, children }) {
  const [hovering, setHovering] = useState(false);
  const showToggle = hovering || node.attributes?.collectedByCurrentUser;
  // const showToggle = true;

  return (
    <li className="table-of-contents__item">
      <div className="table-of-contents__item-inner">
        <Link
          to={linkTo}
          onClick={onClick}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocus={() => setHovering(true)}
          onBlur={() => setHovering(false)}
          data-id="hide-drawer"
          className={classNames({
            "table-of-contents__link": true,
            [`table-of-contents__link--active`]: active || hovering
          })}
        >
          {node.label}
        </Link>
        <span
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          className={classNames({
            "table-of-contents__collecting-toggle": true,
            "table-of-contents__collecting-toggle--hidden": !showToggle
          })}
        >
          <Collecting.Toggle
            collectable={node}
            outlined={false}
            onDialogOpen={() => setHovering(true)}
            onDialogClose={() => setHovering(false)}
          />
        </span>
      </div>
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
