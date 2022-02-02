import React from "react";
import PropTypes from "prop-types";
import Menu from "../parts/Menu";
import MenuItem from "../parts/MenuItem";

function FollowLink({ menu, visible, direction, activeEvent, actions }) {
  const { link, annotationIds } = activeEvent;
  const { openViewAnnotationsDrawer } = actions;

  function handleAnnotateClick() {
    if (!openViewAnnotationsDrawer || !annotationIds) return;
    return openViewAnnotationsDrawer(annotationIds);
  }

  return (
    <Menu
      menu={menu}
      visible={visible}
      aria-label="Follow link"
      direction={direction}
    >
      <MenuItem
        menu={{ ...menu, visible }}
        as="a"
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        kind="none"
        label="Follow link"
        icon="arrowRight32"
      />
      <MenuItem
        menu={{ ...menu, visible }}
        onClick={handleAnnotateClick}
        kind="any"
        label="Annotate"
        icon="comment24"
      />
    </Menu>
  );
}

FollowLink.displayName = "Annotation.Popup.Menus.FollowLink";

FollowLink.propTypes = {
  menu: PropTypes.object.isRequired,
  activeEvent: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  direction: PropTypes.oneOf(["up", "down"]),
  visible: PropTypes.bool
};

export default FollowLink;
