import React from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

function Title({ title, icon }) {
  return (
    <h3 className="overlay-title">
      <IconComposer icon={icon} size={24} iconClass="overlay-title__icon" />
      <span className="overlay-title__text">{title}</span>
    </h3>
  );
}

Title.displayName = "Global.Overlay.Header.Title";

Title.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

export default Title;
