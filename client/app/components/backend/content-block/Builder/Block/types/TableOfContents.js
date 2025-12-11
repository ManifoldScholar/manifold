import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ProjectContentBlocksTableOfContents extends PureComponent {
  static displayName = "Project.Content.Block.Types.TableOfContents";

  static propTypes = {
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    title: "layout.table_of_contents_block_title", // Static props can't be translated in their own class, pass the key to be translated where it's implemented
    icon: "toc64"
  };

  static isAvailable(currentBlocksIgnored) {
    return true;
  }

  render() {
    return this.props.children(this.props);
  }
}
