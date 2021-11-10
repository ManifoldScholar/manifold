import React from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

function Title({ title, icon, id }) {
  return (
    <h2 id={id} className="overlay-title">
      <IconComposer icon={icon} size={24} className="overlay-title__icon" />
      <span className="overlay-title__text">{title}</span>
    </h2>
  );
}

Title.displayName = "Global.Overlay.Header.Title";

Title.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default Title;
