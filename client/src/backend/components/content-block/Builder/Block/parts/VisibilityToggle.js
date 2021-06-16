import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

export default class ProjectContentBlockVisibilityToggle extends PureComponent {
  static displayName = "Project.Content.Block.Parts.VisibilityToggle";

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    entity: PropTypes.object.isRequired,
    entityCallbacks: PropTypes.object.isRequired
  };

  get entity() {
    return this.props.entity;
  }

  get isVisible() {
    return this.entity.attributes.visible;
  }

  render() {
    const baseClass = "backend-content-block";
    if (!this.props.visible) return null;

    if (this.isVisible)
      return (
        <button
          className={`${baseClass}__button`}
          title="Hide content block"
          onClick={this.props.entityCallbacks.hideBlock}
        >
          <Utility.IconComposer
            icon="eyeClosed32"
            size={26}
            iconClass={`${baseClass}__icon ${baseClass}__icon--light`}
          />
        </button>
      );

    return (
      <button
        className={`${baseClass}__button`}
        title="Show content block"
        onClick={this.props.entityCallbacks.showBlock}
      >
        <Utility.IconComposer
          icon="eyeOpen32"
          size={26}
          iconClass={`${baseClass}__icon ${baseClass}__icon--light`}
        />
      </button>
    );
  }
}
