import React from "react";
import PropTypes from "prop-types";
import { Menus } from "reader/components/annotation/popup";
import { useAnnotationMenu } from "reader/components/annotation/popup/hooks";

function LoginMenu({ direction, actions, visible, isKeyboardSelection }) {
  const { menus, activeMenu } = useAnnotationMenu({
    menuArray: ["main"],
    defaultMenu: "main",
    visible
  });

  return (
    <Menus.Login
      menu={menus.main}
      visible={activeMenu === "main"}
      direction={direction}
      actions={actions}
      isKeyboardSelection={isKeyboardSelection}
    />
  );
}

LoginMenu.displayName = "Annotation.Popup.LoginMenu";

LoginMenu.propTypes = {
  actions: PropTypes.object.isRequired,
  direction: PropTypes.oneOf(["up", "down"]),
  visible: PropTypes.bool,
  isKeyboardSelection: PropTypes.bool
};

export default LoginMenu;
