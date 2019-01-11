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

  static isAvailable(currentBlocksIgnored) {
    return true;
  }

  render() {
    return this.props.children(this.props);
  }
}
