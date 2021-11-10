import React from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

function Icons({ useOutline }) {
  return (
    <div className="collecting-toggle__icons">
      <IconComposer
        icon="MinusUnique"
        size={28}
        className="collecting-toggle__icon collecting-toggle__icon--remove"
      />
      <IconComposer
        icon="CheckUnique"
        size={28}
        className="collecting-toggle__icon collecting-toggle__icon--confirm"
      />
      {!useOutline && (
        <IconComposer
          icon="StarFillUnique"
          size="default"
          className="collecting-toggle__icon collecting-toggle__icon--add"
        />
      )}
      {useOutline && (
        <IconComposer
          icon="StarOutlineUnique"
          size="default"
          className="collecting-toggle__icon collecting-toggle__icon--add"
        />
      )}
    </div>
  );
}

Icons.displayName = "Collecting.Toggle.Icons";

Icons.propTypes = {
  useOutline: PropTypes.bool
};

export default Icons;
