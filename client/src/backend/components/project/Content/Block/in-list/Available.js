import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Identity from "../parts/Identity";
import Utility from "global/components/utility";

export default class ProjectContentBlockInListAvailable extends PureComponent {
  static displayName = "Project.Content.Block.InList.Available";

  static propTypes = {
    typeComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
  };

  render() {
    const TypeComponent = this.props.typeComponent;

    return (
      <TypeComponent>
        {block => (
          <div {...this.props.dragHandleProps}>
            <Identity icon={block.icon} title={block.title} />
            <Utility.IconComposer icon="plus" size={50} />
          </div>
        )}
      </TypeComponent>
    );
  }
}
