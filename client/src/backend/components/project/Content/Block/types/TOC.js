import React, { PureComponent } from "react";
import PropTypes from "prop-types";

// TODO: Let's rename this in the API to "TableOfContents" and also rename this file.
export default class ProjectContentBlocksTableOfContents extends PureComponent {
  static displayName = "Project.Content.Block.Types.TOC";

  static propTypes = {
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    title: "Table of Contents",
    icon: "touch"
  };

  static isAvailable(currentBlocks) {
    return true;
  }

  render() {
    return this.props.children(this.props);
  }
}
