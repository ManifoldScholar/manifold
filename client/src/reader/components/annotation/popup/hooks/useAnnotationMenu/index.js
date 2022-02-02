import { useRef, useState, useEffect, useCallback } from "react";
import { useMenuState } from "reakit/Menu";

const MENU_OPTIONS = {
  loop: true
};

export default function useAnnotationMenu({ menuArray, defaultMenu, visible }) {
  const lastFocus = useRef();
  const lastActiveMenu = useRef();

  /**
   * Normally we shouldn't use a hook inside a callback like this.
   * But since `menuArray` never changes, it should be safe to do so here.
   */
  /* eslint-disable react-hooks/rules-of-hooks */
  const menus = Object.fromEntries(
    menuArray.map(menu => [menu, useMenuState(MENU_OPTIONS)])
  );
  /* eslint-enable react-hooks/rules-of-hooks */

  const [activeMenu, setActiveMenu] = useState(null);

  // track the previous state so that we can detect movement between two menus (see `handleKeyDown`)
  useEffect(() => {
    lastActiveMenu.current = activeMenu;
  }, [activeMenu]);

  useEffect(() => {
    if (visible) {
      lastFocus.current = document.activeElement;
      setActiveMenu(defaultMenu);
    } else {
      if (lastFocus.current) {
        lastFocus.current.focus();
      }
      setActiveMenu(null);
    }
  }, [visible, defaultMenu]);

  // Move between main and submenus using left & right arrow keys
  //
  // We use a `data-name` attr on default menu items linked to submenus
  // in order to tell which submenu should be opened on right arrow keyDown
  const handleKeyDown = useCallback(
    (event, sourceMenu) => {
      const {
        key,
        target: { dataset }
      } = event;

      if (key === "ArrowRight" && sourceMenu === defaultMenu && dataset.name) {
        setActiveMenu(dataset.name);
      }

      if (key === "ArrowLeft" && sourceMenu !== defaultMenu) {
        setActiveMenu("main");
      }
    },
    [defaultMenu]
  );

  return {
    menus,
    activeMenu,
    lastActiveMenu,
    setActiveMenu,
    handleKeyDown
  };
}
