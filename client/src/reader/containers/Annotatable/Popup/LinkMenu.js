import React from "react";
import PropTypes from "prop-types";
import { Menus } from "reader/components/annotation/popup";
import { useAnnotationMenu } from "reader/components/annotation/popup/hooks";

function LinkMenu({
  direction,
  visible,
  actions,
  activeEvent,
  clearSelection,
  annotationHref
}) {
  const { menus, activeMenu, handleKeyDown } = useAnnotationMenu({
    menuArray: ["main"],
    defaultMenu: "main",
    visible,
    clearSelection
  });

  return (
    <Menus.FollowLink
      menu={menus.main}
      visible={activeMenu === "main"}
      direction={direction}
      activeEvent={activeEvent}
      actions={actions}
      onKeyDown={handleKeyDown}
      annotationHref={annotationHref}
    />
  );
}

LinkMenu.displayName = "Annotation.Popup.LinkMenu";

LinkMenu.propTypes = {
  activeEvent: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  direction: PropTypes.oneOf(["up", "down"]),
  visible: PropTypes.bool,
  annotationHref: PropTypes.string
};

export default LinkMenu;
