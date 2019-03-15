import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ProjectContentBlocksMetadata extends PureComponent {
  static displayName = "Project.Content.Block.Types.Metadata";

  static propTypes = {
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    title: "Metadata",
    icon: "metadata64"
  };

  static isAvailable(currentBlocks) {
    return (
      currentBlocks.findIndex(block => {
        return block.attributes.type === "Content::MetadataBlock";
      }) === -1
    );
  }

  render() {
    return this.props.children(this.props);
  }
}
