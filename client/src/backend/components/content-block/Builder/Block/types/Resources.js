import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ProjectContentBlocksResources extends PureComponent {
  static displayName = "Project.Content.Block.Types.Resources";

  static propTypes = {
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    title: "layout.resources_block_title", // Static props can't be translated in their own class, pass the key to be translated where it's implemented
    icon: "BEResourcesBox64"
  };

  static isAvailable(currentBlocks) {
    return (
      currentBlocks.findIndex(block => {
        return block.attributes.type === "Content::ResourcesBlock";
      }) === -1
    );
  }

  render() {
    return this.props.children(this.props);
  }
}
