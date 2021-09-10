import React from "react";
import PropTypes from "prop-types";
import { useCollapseContext } from "hooks";

function Content({ children, className }) {
  const { visible, contentProps } = useCollapseContext();

  return (
    <div {...contentProps} className={className} hidden={visible}>
      {typeof children === "function" ? children(visible) : children}
    </div>
  );
}

Content.displayName = "Global.Collapse.Content";

Content.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func
  ]),
  className: PropTypes.string
};

export default Content;
