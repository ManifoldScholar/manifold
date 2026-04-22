import { isValidElement } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import classNames from "classnames";
import useCollapseContext from "./useCollapseContext";

export const inertToggleClass = `
  cursor: default;
  pointer-events: none;
`;

const inertRules = css`
  cursor: default;
  pointer-events: none;
`;

const StyledToggle = styled.button`
  ${({ $inert }) => ($inert ? inertRules : null)}
`;

function Toggle({ children, className, activeClassName, as }) {
  const {
    visible,
    toggleProps,
    labelProps,
    height,
    stubHeight
  } = useCollapseContext();
  const applyLabelPropsToToggle =
    !isValidElement(children) || typeof children === "string";
  const mergedToggleProps = {
    ...toggleProps,
    ...(applyLabelPropsToToggle ? labelProps : {})
  };

  const inert = height <= stubHeight;
  const elementAs = as ?? inert ? "div" : "button";
  const mergedClassName = classNames({
    [className]: !!className,
    [activeClassName]: activeClassName ? visible : false
  });

  return (
    <StyledToggle
      as={elementAs}
      $inert={inert}
      className={mergedClassName || undefined}
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
  activeClassName: PropTypes.string
};

export default Toggle;
