import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import Identity from "../parts/Identity";

export default class ProjectContentBlockInListAvailablePlaceholder extends PureComponent {
  static displayName = "Project.Content.Block.InList.AvailablePlaceholder";

  static propTypes = {
    typeComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
  };

  render() {
    const TypeComponent = this.props.typeComponent;

    return (
      <TypeComponent>
        {block => (
          <div className="content-block__inner">
            <Identity icon={block.icon} title={block.title} />
            <Utility.IconComposer icon="circlePlus32" size={32} />
          </div>
        )}
      </TypeComponent>
    );
  }
}
