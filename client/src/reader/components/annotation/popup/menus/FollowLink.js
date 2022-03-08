import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  return (
    <Menu
      menu={menu}
      visible={visible}
      aria-label={t("reader.follow_link")}
      direction={direction}
    >
      <MenuItem
        menu={{ ...menu, visible }}
        as="a"
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        kind="none"
        label={t("reader.follow_link")}
        icon="arrowRight32"
      />
      <MenuItem
        menu={{ ...menu, visible }}
        onClick={handleAnnotateClick}
        kind="any"
        label={t("action.annotate")}
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
