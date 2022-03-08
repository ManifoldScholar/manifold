import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import classNames from "classnames";
import MenuItem from "reader/components/annotation/popup/parts/MenuItem";

function Highlight({ menu, actions, activeAnnotation }) {
  const { t } = useTranslation();

  function hasActiveAnnotation() {
    if (!activeAnnotation) return false;
    return (
      activeAnnotation.attributes.abilities.delete &&
      activeAnnotation.attributes.format === "highlight"
    );
  }
  const highlighted = hasActiveAnnotation();

  return (
    <>
      <MenuItem
        menu={menu}
        onClick={
          highlighted
            ? () => actions.destroyAnnotation(activeAnnotation)
            : actions.createHighlight
        }
        className={classNames({
          "annotation-popup__button--selected": highlighted
        })}
        kind="any"
        label={t("reader.menus.popup.highlight")}
        srLabel={
          highlighted
            ? t("reader.menus.popup.unhighlight_selection")
            : t("reader.menus.popup.highlight_selection")
        }
        icon="annotate24"
      />
      {highlighted && (
        <div className="annotation-popup__note">
          {activeAnnotation.attributes.currentUserIsCreator
            ? t("reader.menus.popup.you_highlighted")
            : t("reader.menus.popup.reader_highlighted")}
        </div>
      )}
    </>
  );
}

Highlight.displayName = "Annotation.Popup.Menus.MainMenu.Highlight";

Highlight.propTypes = {
  menu: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  activeAnnotation: PropTypes.object
};

export default Highlight;
