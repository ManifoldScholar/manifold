import React from "react";
import PropTypes from "prop-types";
import Menu from "../parts/Menu";
import MenuItem from "../parts/MenuItem";
import { useShareAnnotation } from "../hooks";
import { useEventTracker } from "hooks";
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
  const {
    facebookAppId,
    shareOnTwitter,
    shareOnFacebook
  } = useShareAnnotation({ text, section, selectionState });
  const trackEvent = useEventTracker();

  const canCite = section && !!Object.keys(section.attributes.citations).length;

  function handleCiteClick() {
    trackEvent("cite", section.type, section.id);
    actions.openCitationDrawer();
  }

  function trackSocialEvent() {
    trackEvent("share", section.type, section.id);
  }

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
      <MenuItem
        menu={{ ...menu, visible }}
        onClick={() => {
          shareOnTwitter();
          trackSocialEvent();
        }}
        kind="any"
        icon="socialTwitter32"
        label="Twitter"
        srLabel={t("external_links.share_on_social", { service: "Twitter" })}
      />
      {facebookAppId && (
        <MenuItem
          menu={{ ...menu, visible }}
          onClick={() => {
            shareOnFacebook();
            trackSocialEvent();
          }}
          kind="any"
          icon="socialFacebook32"
          label="Facebook"
          srLabel={t("external_links.share_on_social", { service: "Facebook" })}
        />
      )}
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
