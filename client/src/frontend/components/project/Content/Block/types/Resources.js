import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ProjectContentBlockResourcesBlock extends PureComponent {
  static displayName = "Project.Content.Block.Resources";

  static propTypes = {
    block: PropTypes.object.isRequired
  };

  get block() {
    return this.props.block;
  }

  render() {
    return <div>Resources Block [{this.block.id}]</div>;
  }
}
