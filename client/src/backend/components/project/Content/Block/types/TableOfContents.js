import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ProjectContentBlocksTableOfContents extends PureComponent {
  static displayName = "Project.Content.Block.Types.TableOfContents";

  static propTypes = {
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    title: "Table of Contents",
    icon: "touch"
  };

  static isAvailable(currentBlocksIgnored) {
    return true;
  }

  render() {
    return this.props.children(this.props);
  }
}
