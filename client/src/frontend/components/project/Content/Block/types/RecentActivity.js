import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Wrapper from "../parts/Wrapper";
import Heading from "../parts/Heading";

export default class ProjectContentBlockRecentActivityBlock extends PureComponent {
  static displayName = "Project.Content.Block.RecentActivity";

  static propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
    block: PropTypes.object.isRequired
  };

  static defaultProps = {
    title: "Recent Activity",
    icon: "pulse"
  };

  get block() {
    return this.props.block;
  }

  render() {
    return (
      <Wrapper>
        <Heading title={this.props.title} icon={this.props.icon} />
        <div>Recent Activity Block [{this.block.id}]</div>
      </Wrapper>
    );
  }
}
