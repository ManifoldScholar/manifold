import React from "react";
import PropTypes from "prop-types";
import useResizeObserver from "use-resize-observer";
import { useCollapseContext } from "hooks";

function Content({ children, className }) {
  const { visible, contentProps } = useCollapseContext();
  const { ref: resizeRef, height } = useResizeObserver();

  return (
    <div
      {...contentProps}
      className={className}
      style={{
        height: visible ? height : 0,
        opacity: visible ? 1 : 0,
        visibility: visible ? "visible" : "hidden",
        transition: "height 500ms, opacity 500ms"
      }}
    >
      <div ref={resizeRef}>
        {typeof children === "function" ? children(visible) : children}
      </div>
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
