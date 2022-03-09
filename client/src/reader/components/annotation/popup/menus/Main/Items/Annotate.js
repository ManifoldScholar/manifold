import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import MenuItem from "reader/components/annotation/popup/parts/MenuItem";

function Annotate({ menu, actions }) {
  const { t } = useTranslation();

  return (
    <MenuItem
      menu={menu}
      onClick={actions.openNewAnnotationDrawer}
      kind="any"
      label={t("actions.annotate")}
      srLabel={t("reader.menus.popup.annotate_selection")}
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
