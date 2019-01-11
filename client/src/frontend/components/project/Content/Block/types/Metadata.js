import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ProjectContentBlockMetadataBlock extends PureComponent {
  static displayName = "Project.Content.Block.Metadata";

  static propTypes = {
    block: PropTypes.object.isRequired
  };

  get block() {
    return this.props.block;
  }

  render() {
    return <div>Metadata Block [{this.block.id}]</div>;
  }
}
