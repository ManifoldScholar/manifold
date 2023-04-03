import React from "react";
import PropTypes from "prop-types";
import { Menus } from "reader/components/annotation/popup";
import { useAnnotationMenu } from "reader/components/annotation/popup/hooks";

function LoginMenu({ direction, actions, visible, clearSelection }) {
  const { menus, activeMenu, handleKeyDown } = useAnnotationMenu({
    menuArray: ["main"],
    defaultMenu: "main",
    visible,
    clearSelection
  });

  return (
    <Menus.Login
      menu={menus.main}
      visible={activeMenu === "main"}
      direction={direction}
      actions={actions}
      onKeyDown={handleKeyDown}
    />
  );
}

LoginMenu.displayName = "Annotation.Popup.LoginMenu";

LoginMenu.propTypes = {
  actions: PropTypes.object.isRequired,
  direction: PropTypes.oneOf(["up", "down"]),
  visible: PropTypes.bool
};

export default LoginMenu;
