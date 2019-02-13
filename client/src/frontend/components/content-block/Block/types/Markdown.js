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
    return "lamp";
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
        className="entity-section-wrapper__body entity-section-wrapper__body--narrow page-content"
        dangerouslySetInnerHTML={{ __html: this.formattedContent }}
      />
    );
  }
}
