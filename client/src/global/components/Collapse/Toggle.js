import React from "react";
import PropTypes from "prop-types";
import { useCollapseContext } from "hooks";
import classNames from "classnames";

function Toggle({ children, className, activeClassName }) {
  const { visible, toggleProps, labelProps } = useCollapseContext();
  const applyLabelPropsToToggle =
    !React.isValidElement(children) || typeof children === "string";
  const mergedToggleProps = {
    ...toggleProps,
    ...(applyLabelPropsToToggle ? labelProps : {})
  };
  const finalClassName = classNames({
    [className]: !!className,
    [activeClassName]: activeClassName ? visible : false
  });

  return (
    <button className={finalClassName} {...mergedToggleProps}>
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
  className: PropTypes.string,
  activeClassName: PropTypes.string
};

export default Toggle;
