import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import MenuItem from "reader/components/annotation/popup/parts/MenuItem";

function Resource({ menu, actions, text }) {
  const { t } = useTranslation();

  return (
    <MenuItem
      menu={menu}
      onClick={actions.openResourceAnnotationFormatModal}
      ability="notate"
      entity={text}
      label={t("glossary.resource_one")}
      srLabel={t("reader.menus.popup.attach_resource")}
      icon="resource24"
    />
  );
}

Resource.displayName = "Annotation.Popup.Menus.MainMenu.Resource";

Resource.propTypes = {
  menu: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  text: PropTypes.object.isRequired
};

export default Resource;
