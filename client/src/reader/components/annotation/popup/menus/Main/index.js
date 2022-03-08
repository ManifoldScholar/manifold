import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Menu from "../../parts/Menu";
import MenuItems from "./Items";

function MainMenu({
  menu,
  visible,
  activeMenu,
  lastActiveMenu,
  direction,
  onKeyDown,
  openSubmenu,
  isKeyboardSelection,
  ...restProps
}) {
  const itemProps = {
    menu: { ...menu, visible },
    direction,
    activeMenu,
    ...restProps
  };
  const { t } = useTranslation();

  return (
    <Menu
      menu={menu}
      aria-label={t("actions.annotate")}
      visible={visible}
      activeMenu={activeMenu}
      lastActiveMenu={lastActiveMenu}
      direction={direction}
      onKeyDown={onKeyDown}
      isKeyboardSelection={isKeyboardSelection}
    >
      <MenuItems.Share {...itemProps} onClick={() => openSubmenu("share")} />
      <MenuItems.Notate {...itemProps} />
      <MenuItems.Annotate {...itemProps} />
      <MenuItems.Highlight {...itemProps} />
      <MenuItems.CurrentReadingGroup
        {...itemProps}
        onClick={() => openSubmenu("readingGroup")}
      />
    </Menu>
  );
}

MainMenu.displayName = "Annotation.Popup.Menus.MainMenu";

MainMenu.propTypes = {
  menu: PropTypes.object.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  openSubmenu: PropTypes.func.isRequired,
  visible: PropTypes.bool,
  activeMenu: PropTypes.string,
  lastActiveMenu: PropTypes.shape({
    current: PropTypes.string
  }),
  direction: PropTypes.oneOf(["up", "down"]),
  isKeyboardSelection: PropTypes.bool
};

export default MainMenu;
