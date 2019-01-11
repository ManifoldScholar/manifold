import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ProjectContentBlockMarkdownBlock extends PureComponent {
  static displayName = "Project.Content.Block.Markdown";

  static propTypes = {
    block: PropTypes.object.isRequired
  };

  get block() {
    return this.props.block;
  }

  render() {
    return <div>Markdown Block [{this.block.id}]</div>;
  }
}
