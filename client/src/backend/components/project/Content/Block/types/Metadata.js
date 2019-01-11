import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ProjectContentBlocksMetadata extends PureComponent {
  static displayName = "Project.Content.Block.Types.Metadata";

  static propTypes = {
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    title: "Metadata",
    icon: "globe"
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
