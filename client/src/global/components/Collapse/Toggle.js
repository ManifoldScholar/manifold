import React from "react";
import PropTypes from "prop-types";
import { useCollapseContext } from "hooks";

function Toggle({ children, className }) {
  const { visible, toggleProps, labelProps } = useCollapseContext();

  return (
    <button {...toggleProps} className={className}>
      {typeof children === "function"
        ? children(visible, labelProps)
        : children}
    </button>
  );
}

Toggle.displayName = "Global.Collapse.Toggle";

Toggle.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func
  ]),
  className: PropTypes.string
};

export default Toggle;
