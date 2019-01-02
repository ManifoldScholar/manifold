import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

export default class ProjectContentBlockVisibilityToggle extends PureComponent {
  static displayName = "Project.Content.Block.Parts.VisibilityToggle";

  static propTypes = {
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
    if (this.isVisible)
      return (
        <button
          className="action"
          onClick={this.props.entityCallbacks.hideBlock}
        >
          <Utility.IconComposer icon="eyeOpen" size={30} />
        </button>
      );

    return (
      <button className="action" onClick={this.props.entityCallbacks.showBlock}>
        <Utility.IconComposer icon="eyeClosed" size={30} />
      </button>
    );
  }
}
