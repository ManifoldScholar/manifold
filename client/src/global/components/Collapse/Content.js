import React, { useLayoutEffect, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import useCollapseContext from "./useCollapseContext";

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const getAnimationParams = (height, maxDuration) => {
  /*
  An attempt to make it possible to pass in duration in either sec or ms. Might be a bad
  idea. Could instead force input in ms and convert here.
  */
  const maxDurationSecs = maxDuration > 5 ? maxDuration / 1000 : maxDuration;
  const duration = (
    clamp(height / 800, 0.2, maxDurationSecs ?? 0.5) * 1000
  ).toFixed(0);
  const delay = clamp(duration / 10, 25, 75).toFixed(0);
  const diff = duration - delay;
  return { duration, delay, diff };
};

function Content(props) {
  const {
    children,
    className,
    activeClassName,
    focusOnVisible,
    maxDuration
  } = props;
  const {
    visible,
    contentProps: { resizeRef, ...contentProps },
    toggleVisible,
    height,
    stubHeight
  } = useCollapseContext();

  const finalClassName = classNames({
    collapse__content: true,
    "collapse__content--visible": visible || height <= stubHeight,
    "collapse__content--hidden": !visible,
    "collapse__content--stub": stubHeight,
    "collapse__content--stub-only": height <= stubHeight,
    [className]: className,
    [activeClassName]: activeClassName
  });

  const contentRef = useRef();

  useEffect(() => {
    if (visible && focusOnVisible && contentRef.current) {
      contentRef.current.focus();
    }
  }, [visible, focusOnVisible]);

  const isBrowser =
    typeof window !== "undefined" && !!window.document?.createElement;
  const safeEffect = isBrowser ? useLayoutEffect : useEffect;

  safeEffect(() => {
    if (contentRef.current) {
      const { duration, delay, diff } = getAnimationParams(height, maxDuration);
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

      if (stubHeight)
        contentRef.current.style.setProperty(
          "--hidden-height",
          `${stubHeight}px`
        );
    }
  }, [height, stubHeight, maxDuration]);

  return (
    <div
      {...contentProps}
      ref={contentRef}
      className={finalClassName}
      tabIndex={focusOnVisible ? -1 : null}
    >
      <div ref={resizeRef}>
        {typeof children === "function"
          ? children(visible, toggleVisible)
          : children}
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
  className: PropTypes.string,
  activeClassName: PropTypes.string,
  focusOnVisible: PropTypes.bool,
  maxDuration: PropTypes.number
};

export default Content;
