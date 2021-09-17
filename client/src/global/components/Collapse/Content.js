import React, { useLayoutEffect, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import useResizeObserver from "use-resize-observer";
import { useCollapseContext } from "hooks";
import classNames from "classnames";

const getAnimationParams = height => {
  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
  const duration = (clamp(height / 700, 0.3, 1) * 1000).toFixed(0);
  const delay = clamp(duration / 10, 25, 75).toFixed(0);
  const diff = duration - delay;
  return { duration, delay, diff };
};

function Content({ children, className, activeClassName, focusOnVisible }) {
  const { visible, contentProps } = useCollapseContext();
  const { ref: resizeRef, height } = useResizeObserver();

  const finalClassName = classNames({
    collapse__content: true,
    "collapse__content--visible": visible,
    "collapse__content--hidden": !visible,
    [className]: className,
    [activeClassName]: activeClassName
  });

  const contentRef = useRef();

  useEffect(() => {
    if (visible && contentRef.current) {
      contentRef.current.focus();
    }
  }, [visible]);

  useLayoutEffect(() => {
    if (contentRef.current) {
      const { duration, delay, diff } = getAnimationParams(height);
      contentRef.current.style.setProperty("--collapse-height", `${height}px`);
      contentRef.current.style.setProperty(
        "--collapse-duration",
        `${duration}ms`
      );
      contentRef.current.style.setProperty("--collapse-delay", `${delay}ms`);
      contentRef.current.style.setProperty(
        "--collapse-durationAfterDelay",
        `${diff}ms`
      );
    }
  }, [height]);

  return (
    <div
      {...contentProps}
      ref={contentRef}
      className={finalClassName}
      tabIndex={focusOnVisible ? -1 : null}
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
