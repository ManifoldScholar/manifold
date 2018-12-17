import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ProjectContentBlocksResources extends PureComponent {
  static displayName = "Project.Content.Block.Types.Resources";

  static propTypes = {
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    title: "Resources",
    icon: "resource-document"
  };

  static isAvailable(currentBlocks) {
    return true;
  }

  render() {
    return this.props.children(this.props);
  }
}
