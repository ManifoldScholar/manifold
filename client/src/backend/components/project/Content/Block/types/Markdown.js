import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ProjectContentBlocksMarkdown extends PureComponent {
  static displayName = "Project.Content.Block.Types.Markdown";

  static propTypes = {
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    title: "Markdown",
    icon: "lamp"
  };

  static isAvailable(currentBlocks) {
    // A demonstration of how each block type can decide whether or not its available
    // based on the contents of the currentBlocks relationship.
    return currentBlocks.length <= 3;
  }

  render() {
    return this.props.children(this.props);
  }
}
