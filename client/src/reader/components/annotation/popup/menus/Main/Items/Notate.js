import React from "react";
import PropTypes from "prop-types";
import MenuItem from "reader/components/annotation/popup/parts/MenuItem";

function Notate({ menu, actions, text }) {
  return (
    <MenuItem
      menu={menu}
      onClick={actions.openNewNotationDrawer}
      ability="notate"
      entity={text}
      label="Resource"
      srLabel="Attach resource to selection"
      icon="resource24"
    />
  );
}

Notate.displayName = "Annotation.Popup.Menus.MainMenu.Notate";

Notate.propTypes = {
  menu: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  text: PropTypes.object.isRequired
};

export default Notate;
