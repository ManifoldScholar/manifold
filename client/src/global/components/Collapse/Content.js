import React from "react";
import PropTypes from "prop-types";
import useResizeObserver from "use-resize-observer";
import { useCollapseContext } from "hooks";

function Content({ children, className }) {
  const { visible, contentProps } = useCollapseContext();
  const { ref: resizeRef, height } = useResizeObserver();
  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
  const heightFactor = clamp(height / 400, 0.4, 1) * 1000;

  return (
    <div
      {...contentProps}
      className={className}
      style={{
        height: visible ? height : 0,
        opacity: visible ? 1 : 0,
        visibility: visible ? "visible" : "hidden",
        transition: `height ${heightFactor}ms, opacity ${heightFactor}ms ease-out, ${heightFactor}ms`,
        overflow: "hidden"
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
