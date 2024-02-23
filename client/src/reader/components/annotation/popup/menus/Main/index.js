import React from "react";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "hooks";
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
  const { t } = useTranslation();
  const currentUser = useCurrentUser();

  const { readingGroups, currentReadingGroup } = itemProps;

  // Users who are neither trusted nor established cannot create public annotations or highlights.
  const isPublic =
    currentReadingGroup === "public" ||
    readingGroups.find(group => group.id === currentReadingGroup)?.attributes
      ?.privacy === "public";
  const established = currentUser?.attributes.established;
  const trusted = currentUser?.attributes.trusted;

  const permitAnnotation = established || trusted || !isPublic;

  return (
    <Menu
      menu={menu}
      aria-label={t("actions.annotate")}
      visible={visible}
      activeMenu={activeMenu}
      lastActiveMenu={lastActiveMenu}
      direction={direction}
      onKeyDown={onKeyDown}
    >
      <MenuItems.Share {...itemProps} onClick={() => openSubmenu("share")} />
      {permitAnnotation && (
        <>
          <MenuItems.Notate {...itemProps} />
          <MenuItems.Annotate {...itemProps} />
          <MenuItems.Highlight {...itemProps} />
        </>
      )}
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
