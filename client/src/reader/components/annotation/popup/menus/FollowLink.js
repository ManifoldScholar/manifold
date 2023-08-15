import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Menu from "../parts/Menu";
import MenuItem from "../parts/MenuItem";
import { useHistory } from "react-router-dom";

function FollowLink({
  menu,
  visible,
  direction,
  activeEvent,
  actions,
  onKeyDown,
  annotationHref
}) {
  const { link, annotationIds } = activeEvent;
  const { openViewAnnotationsDrawer } = actions;

  const history = useHistory();

  function handleAnnotateClick() {
    if (!openViewAnnotationsDrawer || !annotationIds) return;
    if (annotationHref) history.push(annotationHref);
    return openViewAnnotationsDrawer(annotationIds);
  }
  const { t } = useTranslation();

  return (
    <Menu
      menu={menu}
      visible={visible}
      aria-label={t("reader.menus.popup.follow_link")}
      direction={direction}
      onKeyDown={onKeyDown}
    >
      <MenuItem
        menu={{ ...menu, visible }}
        as="a"
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        kind="none"
        label={t("reader.menus.popup.follow_link")}
        icon="arrowRight32"
      />
      <MenuItem
        menu={{ ...menu, visible }}
        onClick={handleAnnotateClick}
        kind="any"
        label={t("actions.annotate")}
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
  visible: PropTypes.bool,
  annotationHref: PropTypes.string
};

export default FollowLink;
