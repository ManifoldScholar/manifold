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

  get blockBgClass() {
    const blockStyle = this.block.attributes.style;

    return blockStyle === "shaded" ? "bg-neutral05" : "";
  }

  get formattedContent() {
    return this.block.attributes.bodyFormatted;
  }

  render() {
    const blockClass = "entity-section-wrapper";
    return (
      <Wrapper additionalClasses={this.blockBgClass}>
        <div
          className={`${blockClass}__body ${blockClass}__body--narrow page-content`}
          dangerouslySetInnerHTML={{ __html: this.formattedContent }}
        />
      </Wrapper>
    );
  }
}
