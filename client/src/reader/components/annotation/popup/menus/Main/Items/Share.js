import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import MenuItem from "reader/components/annotation/popup/parts/MenuItem";

function Share({ menu, onClick, activeMenu }) {
  const { t } = useTranslation();

  return (
    <MenuItem
      menu={menu}
      onClick={onClick}
      aria-haspopup="menu"
      aria-expanded={activeMenu === "share"}
      data-name="share"
      kind="any"
      label={t("actions.share")}
      srLabel={t("reader.menus.popup.share_selection")}
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
