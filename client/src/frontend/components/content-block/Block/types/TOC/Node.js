import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";

function TOCListNode({
  id,
  anchor,
  title,
  textSlug,
  textTitle,
  className = "toc-block",
  children
}) {
  const to = lh.link("readerSection", textSlug, id, anchor ? `#${anchor}` : "");

  return (
    <li className={`${className}__node`}>
      <Link className={`${className}__link`} to={to}>
        <span>{title}</span>
        {textTitle && (
          <span className={`${className}__from-title`}>
            in <i>{textTitle}</i>
          </span>
        )}
      </Link>
      {children}
    </li>
  );
}

TOCListNode.displayName = "ContentBlock.Types.TOC.Node";

TOCListNode.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  textSlug: PropTypes.string.isRequired,
  anchor: PropTypes.string,
  children: PropTypes.node
};

export default TOCListNode;
