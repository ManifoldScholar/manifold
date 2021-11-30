import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import TOC from "frontend/components/toc";

export default class ProjectContentBlockTableOfContentsBlock extends PureComponent {
  static displayName = "Project.Content.Block.TableOfContents";

  static propTypes = {
    block: PropTypes.object.isRequired
  };

  static get title() {
    return "Table of Contents";
  }

  static get icon() {
    return "toc64";
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
      <nav aria-label="Table of Contents">
        <TOC.List
          showTextTitle={this.showTextTitle}
          showAuthors={this.showAuthors}
          text={this.text}
          depth={this.depth}
        />
      </nav>
    );
  }
}
