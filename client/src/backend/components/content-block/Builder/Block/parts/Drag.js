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
    const iconClass = `${this.props.baseClass}__icon ${
      this.props.baseClass
    }__icon--light`;

    return (
      <div
        className={`${this.props.baseClass}__button ${
          this.props.baseClass
        }__button--draggable`}
        {...this.props.dragHandleProps}
        role="button"
        tabIndex="0"
      >
        <Utility.IconComposer
          icon="barsDoubleHorizontal"
          size={26}
          iconClass={iconClass}
        />
      </div>
    );
  }
}
