import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { capitalize } from "utils/string";
import TOC from "frontend/components/toc";

class ProjectContentBlockTableOfContentsBlock extends PureComponent {
  static displayName = "Project.Content.Block.TableOfContents";

  static propTypes = {
    block: PropTypes.object.isRequired,
    t: PropTypes.func
  };

  static get title() {
    return capitalize(this.props.t("glossary.table_of_contents"));
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
      <nav aria-label={capitalize(this.props.t("glossary.table_of_contents"))}>
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

export default withTranslation()(ProjectContentBlockTableOfContentsBlock);
