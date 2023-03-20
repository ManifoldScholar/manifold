import React, { useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Menu as ReakitMenu } from "reakit/Menu";

function Menu({
  menu,
  activeMenu,
  lastActiveMenu,
  onKeyDown,
  direction,
  children,
  ...menuProps
}) {
  // Focus on first interactive el when menu becomes visible.
  // Or on last interactive el if moving from RG menu to main menu.
  useEffect(() => {
    if (!menuProps.visible) return;
    const fromRGtoMain =
      activeMenu === "main" && lastActiveMenu?.current === "readingGroup";
    fromRGtoMain ? menu.last() : menu.first();
  }, [menuProps.visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const menuClassName = classNames({
    "annotation-popup__menu": true,
    "annotation-popup__menu--active": menuProps.visible,
    "annotation-popup__menu--bottom": direction === "up",
    "annotation-popup__menu--top": direction === "down"
  });
  const tailClassName = classNames({
    "annotation-popup__tail": true,
    "annotation-popup__tail--down": direction === "up",
    "annotation-popup__tail--up": direction === "down"
  });
  return (
    <ReakitMenu
      {...menu}
      {...menuProps}
      unstable_autoFocusOnHide={false} // we handle this on our own since there's no disclosure component
      className={menuClassName}
      onKeyDown={onKeyDown}
    >
      <div className="annotation-popup__menu-inner">{children}</div>
      <div className={tailClassName} />
    </ReakitMenu>
  );
}

Menu.displayName = "Annotation.Popup.Menu.Menu";

Menu.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  menu: PropTypes.object.isRequired,
  onKeyDown: PropTypes.func,
  activeMenu: PropTypes.string,
  lastActiveMenu: PropTypes.shape({
    current: PropTypes.string
  }),
  visible: PropTypes.bool,
  submenu: PropTypes.bool
};

export default Menu;
