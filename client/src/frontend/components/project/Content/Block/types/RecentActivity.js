import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ProjectContentBlockRecentActivityBlock extends PureComponent {
  static displayName = "Project.Content.Block.RecentActivity";

  static propTypes = {
    block: PropTypes.object.isRequired
  };

  get block() {
    return this.props.block;
  }

  render() {
    return <div>Recent Activity Block [{this.block.id}]</div>;
  }
}
