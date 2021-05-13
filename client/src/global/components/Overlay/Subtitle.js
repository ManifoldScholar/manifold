import React from "react";
import PropTypes from "prop-types";

function Subtitle({ subtitle }) {
  return <p className="overlay-full-header__subtitle">{subtitle}</p>;
}

Subtitle.displayName = "Global.Overlay.Header.Subtitle";

Subtitle.propTypes = {
  subtitle: PropTypes.string.isRequired
};

export default Subtitle;
