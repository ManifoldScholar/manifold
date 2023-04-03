import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Menu from "../parts/Menu";
import MenuItem from "../parts/MenuItem";

function Login({ menu, visible, direction, actions, onKeyDown }) {
  const { t } = useTranslation();

  return (
    <Menu
      menu={menu}
      visible={visible}
      aria-label={t("reader.menus.popup.log_in_annotate")}
      direction={direction}
      onKeyDown={onKeyDown}
    >
      <MenuItem
        menu={menu}
        onClick={actions.showLogin}
        kind="unauthenticated"
        label={t("reader.menus.popup.log_in_annotate")}
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
