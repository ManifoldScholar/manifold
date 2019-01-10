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
    const baseClass = "content-block";
    if (!this.props.visible) return null;

    if (this.isVisible)
      return (
        <button
          className={`${baseClass}__button`}
          onClick={this.props.entityCallbacks.hideBlock}
        >
          <Utility.IconComposer
            icon="eye-open"
            size={26}
            iconClass={`${baseClass}__icon ${baseClass}__icon--light`} />
        </button>
      );

    return (
      <button
        className={`${baseClass}__button`}
        onClick={this.props.entityCallbacks.showBlock}>
        <Utility.IconComposer
          icon="eye-closed"
          size={26}
          iconClass={`${baseClass}__icon ${baseClass}__icon--light`} />
      </button>
    );
  }
}
