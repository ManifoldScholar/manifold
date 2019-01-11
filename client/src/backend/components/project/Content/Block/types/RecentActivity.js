import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ProjectContentBlocksRecentActivity extends PureComponent {
  static displayName = "Project.Content.Block.Types.RecentActivity";

  static propTypes = {
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    title: "Recent Activity",
    icon: "booksOnShelf"
  };

  static isAvailable(currentBlocks) {
    return (
      currentBlocks.findIndex(block => {
        return block.attributes.type === "Content::RecentActivityBlock";
      }) === -1
    );
  }

  render() {
    return this.props.children(this.props);
  }
}
