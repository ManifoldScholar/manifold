import React from "react";
import PropTypes from "prop-types";

function Panel({
  label,
  heading,
  instructions,
  children,
  onProceed,
  onCancel
}) {
  return (
    <form onSubmit={onProceed} className="group-action-panel">
      <h3 className="group-action-panel__label">{label}</h3>
      <p className="group-action-panel__heading">{heading}</p>
      <p className="group-action-panel__instructions">{instructions}</p>
      {children}
      <div className="group-action-panel__actions">
        <button type="submit" className="button-secondary">
          {label}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="button-secondary button-secondary--dull"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

Panel.displayName = "ReadingGroup.Settings.Panel";

Panel.propTypes = {
  label: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  instructions: PropTypes.string.isRequired,
  children: PropTypes.node,
  onProceed: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default Panel;
