import React from "react";
import PropTypes from "prop-types";

function ActionBox({ title, instructions, actions }) {
  return (
    <div className="group-action-box">
      <div className="group-action-box__heading">
        <span className="group-action-box__heading-text">{title}</span>
        <span className="group-action-box__instructions">{instructions}</span>
      </div>
      <div className="group-action-box__actions">{actions}</div>
    </div>
  );
}

ActionBox.displayName = "ReadingGroup.ActionBox";

ActionBox.propTypes = {
  title: PropTypes.string.isRequired,
  instructions: PropTypes.string.isRequired,
  actions: PropTypes.node.isRequired
};

export default ActionBox;
