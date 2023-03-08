import React, { useLayoutEffect, useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import useResizeObserver from "use-resize-observer";
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
    clamp(height / 700, 0.3, maxDurationSecs ?? 0.5) * 1000
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
    maxDuration,
    stubHeight
  } = props;
  const { visible, contentProps, toggleVisible } = useCollapseContext();
  const { ref: resizeRef, height } = useResizeObserver();
  const [isMounted, setIsMounted] = useState(false);

  const finalClassName = classNames({
    collapse__content: true,
    "collapse__content--visible": visible || height < stubHeight,
    "collapse__content--hidden": !visible,
    "collapse__content--stub": stubHeight,
    "collapse__content--stub-only": height < stubHeight,
    [className]: className,
    [activeClassName]: activeClassName
  });

  const contentRef = useRef();

  useEffect(() => {
    if (visible && focusOnVisible && contentRef.current) {
      contentRef.current.focus();
    }
  }, [visible, focusOnVisible]);

  useLayoutEffect(() => {
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

  useEffect(() => {
    setIsMounted(true);
  }, [setIsMounted]);

  useEffect(() => {
    if (isMounted && contentRef.current) {
      const interactiveElSelector = [
        "a[href]",
        "button:not(:disabled)",
        'input:not([disabled]):not([type="hidden"])',
        "select:not([disabled])",
        "textarea:not([disabled])",
        "[contenteditable]",
        '[tabindex]:not([tabindex="-1"])',
        "summary",
        "[href]"
      ].join(", ");
      const interactiveEls = contentRef.current.querySelectorAll(
        interactiveElSelector
      );
      interactiveEls.forEach(el =>
        el.setAttribute("tabIndex", visible ? 0 : -1)
      );
    }
  }, [visible, isMounted]);

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
