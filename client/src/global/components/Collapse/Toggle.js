import React from "react";
import PropTypes from "prop-types";
import { ClassNames } from "@emotion/react";
import useCollapseContext from "./useCollapseContext";

function Toggle({ children, className, activeClassName, as }) {
  const { visible, toggleProps, labelProps } = useCollapseContext();
  const applyLabelPropsToToggle =
    !React.isValidElement(children) || typeof children === "string";
  const mergedToggleProps = {
    ...toggleProps,
    ...(applyLabelPropsToToggle ? labelProps : {})
  };

  const ToggleComponent = as ?? "button";

  return (
    <ClassNames>
      {({ cx }) => (
        <ToggleComponent
          className={cx({
            [className]: !!className,
            [activeClassName]: activeClassName ? visible : false
          })}
          {...mergedToggleProps}
        >
          {typeof children === "function"
            ? children(visible, labelProps)
            : children}
        </ToggleComponent>
      )}
    </ClassNames>
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
