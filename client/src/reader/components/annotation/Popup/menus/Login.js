import React from "react";
import PropTypes from "prop-types";
import Menu from "../parts/Menu";
import MenuItem from "../parts/MenuItem";

function Login({ menu, visible, direction, actions }) {
  return (
    <Menu
      menu={menu}
      visible={visible}
      aria-label="Log in to annotate"
      direction={direction}
    >
      <MenuItem
        menu={menu}
        onClick={actions.showLogin}
        kind="unauthenticated"
        label="Log in to Annotate"
        icon="editProfile24"
      />
    </Menu>
  );
}

Login.displayName = "Annotation.Popup.Menus.Login";

Login.propTypes = {
  menu: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  direction: PropTypes.oneOf(["up", "down"]),
  visible: PropTypes.bool
};

export default Login;
