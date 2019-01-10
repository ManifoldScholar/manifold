import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ProjectContentBlocksResources extends PureComponent {
  static displayName = "Project.Content.Block.Types.Resources";

  static propTypes = {
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    title: "Resources",
    icon: "cube-shine"
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
