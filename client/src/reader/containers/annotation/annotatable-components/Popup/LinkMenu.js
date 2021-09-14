import React from "react";
import PropTypes from "prop-types";
import { Menus } from "reader/components/annotation/popup";
import { useAnnotationMenu } from "reader/components/annotation/popup/hooks";

function LinkMenu({ direction, visible, actions, activeEvent }) {
  const { menus, activeMenu } = useAnnotationMenu({
    menuArray: ["main"],
    defaultMenu: "main",
    visible
  });

  return (
    <Menus.FollowLink
      menu={menus.main}
      visible={activeMenu === "main"}
      direction={direction}
      activeEvent={activeEvent}
      actions={actions}
    />
  );
}

LinkMenu.displayName = "Annotation.Popup.LinkMenu";

LinkMenu.propTypes = {
  activeEvent: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  direction: PropTypes.oneOf(["up", "down"]),
  visible: PropTypes.bool
};

export default LinkMenu;
