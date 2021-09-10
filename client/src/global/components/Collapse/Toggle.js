import React from "react";
import PropTypes from "prop-types";
import { useCollapseContext } from "hooks";

function Toggle({ children, className }) {
  const { visible, toggleProps, labelProps } = useCollapseContext();
  const applyLabelPropsToToggle =
    !React.isValidElement(children) || typeof children === "string";
  const mergedToggleProps = {
    ...toggleProps,
    ...(applyLabelPropsToToggle ? labelProps : {}),
    className
  };

  return (
    <button {...mergedToggleProps}>
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
