import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function HeadingDetailsToggle({ onClick, controls, active }) {
  return (
    <button
      onClick={onClick}
      aria-expanded={active}
      aria-controls={controls}
      className={classNames({
        "group-page-heading__nav-button": true,
        "button-tertiary": true,
        "button-tertiary--active": active
      })}
    >
      Details
    </button>
  );
}

HeadingDetailsToggle.displayName = "ReadingGroup.Heading.DetailsToggle";

HeadingDetailsToggle.propTypes = {
  onClick: PropTypes.func.isRequired,
  controls: PropTypes.string.isRequired,
  active: PropTypes.bool
};

export default HeadingDetailsToggle;
