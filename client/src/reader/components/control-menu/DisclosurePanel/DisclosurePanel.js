import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

const ControlMenuDisclosurePanel = forwardRef((props, ref) => {
  const { id, visible, direction, children, ...rest } = props;
  return (
    <Styled.Panel
      id={id}
      ref={ref}
      {...(!visible ? { inert: "" } : {})}
      className={`reader-header__panels ${
        direction ? `reader-header__panels--${direction}` : ""
      }`}
      tabIndex={-1}
      {...rest}
    >
      {children}
    </Styled.Panel>
  );
});

ControlMenuDisclosurePanel.displayName = "ControlMenu.DisclosurePanel";

ControlMenuDisclosurePanel.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  visible: PropTypes.bool,
  direction: PropTypes.oneOf(["left", "right"])
};

export default ControlMenuDisclosurePanel;
