import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Wrapper from "../parts/Wrapper";

export default class ProjectContentBlockMarkdownBlock extends PureComponent {
  static displayName = "Project.Content.Block.Markdown";

  static propTypes = {
    block: PropTypes.object.isRequired
  };

  get block() {
    return this.props.block;
  }

  render() {
    return (
      <Wrapper>
        <div>Markdown Block [{this.block.id}]</div>
      </Wrapper>
    );
  }
}
