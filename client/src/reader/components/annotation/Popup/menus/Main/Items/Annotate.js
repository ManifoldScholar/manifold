import React from "react";
import PropTypes from "prop-types";
import MenuItem from "reader/components/annotation/popup/parts/MenuItem";

function Annotate({ menu, actions }) {
  return (
    <MenuItem
      menu={menu}
      onClick={actions.openNewAnnotationDrawer}
      kind="any"
      label="Annotate"
      srLabel="Annotate selection"
      icon="comment24"
    />
  );
}

Annotate.displayName = "Annotation.Popup.Menus.MainMenu.Annotate";

Annotate.propTypes = {
  menu: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

export default Annotate;
