import React, { PureComponent } from "react";
import PropTypes from "prop-types";
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
          <React.Fragment>
            <Identity icon={block.icon} title={block.title} />
          </React.Fragment>
        )}
      </TypeComponent>
    );
  }
}
