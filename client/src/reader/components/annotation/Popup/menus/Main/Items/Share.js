import React from "react";
import PropTypes from "prop-types";
import MenuItem from "reader/components/annotation/popup/parts/MenuItem";

function Share({ menu, onClick, activeMenu }) {
  return (
    <MenuItem
      menu={menu}
      onClick={onClick}
      aria-haspopup="menu"
      aria-expanded={activeMenu === "share"}
      data-name="share"
      kind="any"
      label="Share"
      srLabel="Share selection"
      icon="share24"
    />
  );
}

Share.displayName = "Annotation.Popup.Menus.MainMenu.Share";

Share.propTypes = {
  menu: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  activeMenu: PropTypes.string
};

export default Share;
