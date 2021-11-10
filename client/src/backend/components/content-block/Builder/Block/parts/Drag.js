import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

export default class ProjectContentBlockInListPartsDrag extends PureComponent {
  static displayName = "Project.Content.Block.InList.Part.Drag";

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    baseClass: PropTypes.string.isRequired,
    dragHandleProps: PropTypes.object
  };

  render() {
    if (!this.props.visible) return null;
    const className = `${this.props.baseClass}__icon ${this.props.baseClass}__icon--light`;

    return (
      <div
        className={`${this.props.baseClass}__button ${this.props.baseClass}__button--draggable`}
        {...this.props.dragHandleProps}
      >
        <Utility.IconComposer
          icon="grabber32"
          size={26}
          className={className}
        />
      </div>
    );
  }
}
