import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ProjectContentBlockHeroBlock extends PureComponent {
  static displayName = "Project.Content.Block.Hero";

  static propTypes = {
    block: PropTypes.object.isRequired
  };

  get block() {
    return this.props.block;
  }

  render() {
    return <div>Hero Block [{this.block.id}]</div>;
  }
}
