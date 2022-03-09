import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import MenuItem from "reader/components/annotation/popup/parts/MenuItem";

function Notate({ menu, actions, text }) {
  const { t } = useTranslation();

  return (
    <MenuItem
      menu={menu}
      onClick={actions.openNewNotationDrawer}
      ability="notate"
      entity={text}
      label={t("glossary.resource_one")}
      srLabel={t("reader.menus.popup.attach_resource")}
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
