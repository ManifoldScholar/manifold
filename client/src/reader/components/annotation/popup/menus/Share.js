import React from "react";
import PropTypes from "prop-types";
import Menu from "../parts/Menu";
import MenuItem from "../parts/MenuItem";
import { useEventTracker, useShare, useCopyLinkToSelection } from "hooks";
import { t } from "i18next";

function ShareMenu({
  menu,
  visible,
  direction,
  text,
  section,
  selectionState,
  actions,
  onBackClick,
  onKeyDown
}) {
  const trackEvent = useEventTracker();

  const canCite = section && !!Object.keys(section.attributes.citations).length;

  function handleCiteClick() {
    trackEvent("cite", section.type, section.id);
    actions.openCitationDrawer();
  }

  function trackShareEvent() {
    trackEvent("share", section.type, section.id);
  }

  const { onClick: onShareClick, canRender: canShare } = useShare(
    section.attributes.name,
    true
  );

  const handleShareClick = async () => {
    const { err } = (await onShareClick()) ?? {};
    if (!err) trackShareEvent();
  };

  const {
    onClick: onCopyClick,
    label: copyLabel,
    icon: copyIcon,
    srLabel: copySrLabel
  } = useCopyLinkToSelection(text, section, selectionState);

  return (
    <Menu
      menu={menu}
      visible={visible}
      aria-label={t("actions.share")}
      direction={direction}
      onKeyDown={onKeyDown}
    >
      {canCite && (
        <MenuItem
          menu={{ ...menu, visible }}
          onClick={handleCiteClick}
          kind="any"
          label={t("reader.menus.popup.cite")}
          srLabel={t("reader.menus.popup.cite_selection")}
          icon="socialCite32"
        />
      )}
      {canShare && (
        <MenuItem
          menu={{ ...menu, visible }}
          onClick={handleShareClick}
          kind="any"
          label={t("reader.menus.popup.app_share")}
          srLabel={t("reader.menus.popup.share_selection")}
          icon="link24"
        />
      )}
      <MenuItem
        menu={{ ...menu, visible }}
        onClick={onCopyClick}
        kind="any"
        label={copyLabel}
        srLabel={copySrLabel}
        icon={copyIcon}
      />
      <MenuItem
        menu={{ ...menu, visible }}
        onClick={onBackClick}
        kind="any"
        label={t("navigation.back")}
        icon="arrowLeft32"
        className="annotation-popup__button--secondary-dark"
      />
    </Menu>
  );
}

ShareMenu.displayName = "Annotation.Popup.Menus.Share";

ShareMenu.propTypes = {
  menu: PropTypes.object.isRequired,
  section: PropTypes.object.isRequired,
  onBackClick: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
  direction: PropTypes.oneOf(["up", "down"]),
  visible: PropTypes.bool,
  text: PropTypes.object,
  selectionState: PropTypes.object
};

export default ShareMenu;
