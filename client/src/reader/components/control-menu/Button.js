import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";

export default function ControlMenuButton({
  onClick,
  icon,
  label,
  active,
  ariaControls,
  ariaHasPopup
}) {
  const handleClick = event => {
    event.stopPropagation();
    onClick();
  };

  const buttonClass = classNames({
    "reader-header__button": true,
    "reader-header__button--pad-narrow": true,
    "button-active": active
  });

  return (
    <button
      className={buttonClass}
      onClick={handleClick}
      data-id={`toggle-${label}`}
      aria-expanded={active}
      aria-controls={ariaControls}
      {...(ariaHasPopup ? { "aria-haspopup": ariaHasPopup } : {})}
    >
      <Utility.IconComposer icon={icon} size={32} />
      <span className="screen-reader-text">{label}</span>
    </button>
  );
}

ControlMenuButton.displayName = "ControlMenu.Button";

ControlMenuButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool,
  ariaControls: PropTypes.string,
  ariaHasPopup: PropTypes.string
};
