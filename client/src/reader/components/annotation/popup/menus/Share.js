import React from "react";
import PropTypes from "prop-types";
import Menu from "../parts/Menu";
import MenuItem from "../parts/MenuItem";
import { useShareAnnotation } from "../hooks";
import { useEventTracker } from "hooks";

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
      aria-label="Share"
      direction={direction}
      onKeyDown={onKeyDown}
    >
      {canCite && (
        <MenuItem
          menu={{ ...menu, visible }}
          onClick={handleCiteClick}
          kind="any"
          label="Cite"
          srLabel="Cite selection"
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
        srLabel="Share on Twitter"
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
          srLabel="Share on Facebook"
        />
      )}
      <MenuItem
        menu={{ ...menu, visible }}
        onClick={onBackClick}
        kind="any"
        label="Back"
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
