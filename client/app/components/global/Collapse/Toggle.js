import { isValidElement } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import classNames from "classnames";
import useCollapseContext from "./useCollapseContext";

export const inertToggleClass = `
  cursor: default;
  pointer-events: none;
`;

const StyledToggle = styled.button`
  ${({ $inert }) => ($inert ? inertToggleClass : null)}
`;

function Toggle({
  children,
  className,
  activeClassName,
  as,
  hideAriaExpanded
}) {
  const {
    visible,
    toggleProps,
    labelProps,
    height,
    stubHeight
  } = useCollapseContext();
  const {
    "aria-expanded": dynamicAriaExpanded,
    ...restToggleProps
  } = toggleProps;
  const applyLabelPropsToToggle =
    !isValidElement(children) || typeof children === "string";
  const mergedToggleProps = {
    ...restToggleProps,
    ...(applyLabelPropsToToggle ? labelProps : {})
  };

  const ToggleComponent = as ?? (height <= stubHeight ? "div" : "button");

  return (
    <StyledToggle
      as={ToggleComponent}
      $inert={height <= stubHeight}
      className={classNames({
        [className]: !!className,
        [activeClassName]: activeClassName ? visible : false
      })}
      // if changing the toggle text on expand/collapse, don't use aria-expanded
      aria-expanded={hideAriaExpanded ? undefined : dynamicAriaExpanded}
      {...mergedToggleProps}
    >
      {typeof children === "function"
        ? children(visible, labelProps)
        : children}
    </StyledToggle>
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
  activeClassName: PropTypes.string,
  ariaExpanded: PropTypes.bool
};

export default Toggle;
