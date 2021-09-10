import React, { useLayoutEffect, useRef } from "react";
import PropTypes from "prop-types";
import useResizeObserver from "use-resize-observer";
import { useCollapseContext } from "hooks";
import classNames from "classnames";

const getAnimationParams = height => {
  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
  const heightToMs = (clamp(height / 700, 0.3, 1) * 1000).toFixed(0);
  const delay = clamp(heightToMs / 10, 25, 75).toFixed(0);
  const diff = heightToMs - delay;
  return { heightToMs, delay, diff };
};

function Content({ children, className }) {
  const { visible, contentProps } = useCollapseContext();
  const { ref: resizeRef, height } = useResizeObserver();

  const finalClassName = classNames({
    collapse__content: true,
    "collapse__content--visible": visible,
    "collapse__content--hidden": !visible,
    [className]: className
  });

  const contentRef = useRef();

  useLayoutEffect(() => {
    if (contentRef.current) {
      const { heightToMs, delay, diff } = getAnimationParams(height);
      contentRef.current.style.setProperty("--height", `${height}px`);
      contentRef.current.style.setProperty("--heightToMs", `${heightToMs}ms`);
      contentRef.current.style.setProperty("--delay", `${delay}ms`);
      contentRef.current.style.setProperty("--diff", `${diff}ms`);
    }
  }, [height]);

  return (
    <div {...contentProps} ref={contentRef} className={finalClassName}>
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
