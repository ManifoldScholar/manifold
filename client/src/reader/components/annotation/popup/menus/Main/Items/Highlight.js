import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import MenuItem from "reader/components/annotation/popup/parts/MenuItem";

function Highlight({ menu, actions, activeAnnotation }) {
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
        label="Highlight"
        srLabel="Highlight selection"
        icon="annotate24"
      />
      {highlighted && (
        <div className="annotation-popup__note">
          {activeAnnotation.attributes.currentUserIsCreator
            ? "You Highlighted"
            : "A Reader Highlighted"}
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
