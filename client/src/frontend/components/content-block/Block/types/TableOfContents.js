import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Contents from "./TOCBlock/Contents";

export default class ProjectContentBlockTableOfContentsBlock extends PureComponent {
  static displayName = "Project.Content.Block.TableOfContents";

  static propTypes = {
    block: PropTypes.object.isRequired
  };

  static get title() {
    return "Table of Contents";
  }

  static get icon() {
    return "bulletList";
  }

  get blockAttributes() {
    return this.props.block.attributes;
  }

  get text() {
    return this.props.block.relationships.text;
  }

  get depth() {
    return this.blockAttributes.depth;
  }

  get showAuthors() {
    return this.blockAttributes.showAuthors;
  }

  get showTextTitle() {
    return this.blockAttributes.showTextTitle;
  }

  render() {
    return (
      <div className="entity-section-wrapper__body">
        <Contents
          showTextTitle={this.showTextTitle}
          showAuthors={this.showAuthors}
          text={this.text}
          depth={this.depth}
        />
      </div>
    );
  }
}
