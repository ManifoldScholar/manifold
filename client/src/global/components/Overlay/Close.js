import React from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

function CloseButton({ onClick }) {
  return (
    <button onClick={onClick} className="overlay-close">
      <span className="overlay-close__text">Close</span>
      <IconComposer
        icon="close24"
        size="default"
        iconClass="overlay-close__icon"
      />
    </button>
  );
}

CloseButton.displayName = "Global.Overlay.Header.Close";

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default CloseButton;
