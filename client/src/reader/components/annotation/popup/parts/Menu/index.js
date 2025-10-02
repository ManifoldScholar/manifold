import { useEffect } from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

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

  return (
    <Styled.Menu
      {...menu}
      {...menuProps}
      unstable_autoFocusOnHide={false} // we handle this on our own since there's no disclosure component
      onKeyDown={onKeyDown}
      data-active={menuProps.visible}
      data-direction={direction}
    >
      <div>{children}</div>
    </Styled.Menu>
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
