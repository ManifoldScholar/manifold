import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ProjectContentBlockMarkdownBlock extends PureComponent {
  static displayName = "Project.Content.Block.Markdown";

  static propTypes = {
    block: PropTypes.object.isRequired
  };

  static get placeholderTitle() {
    return "Markdown";
  }

  static get icon() {
    return "lamp64";
  }

  get block() {
    return this.props.block;
  }

  get formattedContent() {
    return this.block.attributes.bodyFormatted;
  }

  render() {
    return (
      <div
        className="page-content"
        dangerouslySetInnerHTML={{ __html: this.formattedContent }}
      />
    );
  }
}
