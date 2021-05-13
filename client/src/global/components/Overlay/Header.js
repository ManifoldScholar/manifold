import React from "react";
import PropTypes from "prop-types";
import Title from "./Title";
import Subtitle from "./Subtitle";
import CloseButton from "./Close";

function Header({ title, subtitle, icon, onCloseClick }) {
  return (
    <header className="overlay-full-header" key="globalOverlayHeader">
      <div className="overlay-full-header__inner">
        <div className="overlay-full-header__middle">
          {title && <Title title={title} icon={icon} />}
        </div>
        <div className="overlay-full-header__start">
          {subtitle && <Subtitle subtitle={subtitle} />}
        </div>
        <div className="overlay-full-header__end">
          <CloseButton onClick={onCloseClick} />
        </div>
      </div>
    </header>
  );
}

Header.displayName = "Global.Overlay.Header";

Header.propTypes = {
  onCloseClick: PropTypes.func.isRequired,
  icon: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string
};

export default Header;
