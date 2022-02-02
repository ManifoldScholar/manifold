import React from "react";
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
  ...restProps
}) {
  const itemProps = {
    menu: { ...menu, visible },
    direction,
    activeMenu,
    ...restProps
  };

  return (
    <Menu
      menu={menu}
      aria-label="Annotate"
      visible={visible}
      activeMenu={activeMenu}
      lastActiveMenu={lastActiveMenu}
      direction={direction}
      onKeyDown={onKeyDown}
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
  direction: PropTypes.oneOf(["up", "down"])
};

export default MainMenu;
