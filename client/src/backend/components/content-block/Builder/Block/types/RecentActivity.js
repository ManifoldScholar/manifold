import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ProjectContentBlocksRecentActivity extends PureComponent {
  static displayName = "Project.Content.Block.Types.RecentActivity";

  static propTypes = {
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    title: "layout.recent_activity_block_title", // Static props can't be translated in their own class, pass the key to be translated where it's implemented
    icon: "recentActivity64"
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
