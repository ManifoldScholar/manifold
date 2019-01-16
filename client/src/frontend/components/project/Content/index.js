import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Block from "./Block";

export default class ProjectContent extends PureComponent {
  static displayName = "Project.Content";

  static propTypes = {
    project: PropTypes.object
  };

  get project() {
    return this.props.project;
  }

  get contentBlocks() {
    return this.project.relationships.contentBlocks || [];
  }

  render() {
    return this.contentBlocks.map(block => {
      return <Block block={block} key={block.id} project={this.project} />;
    });
  }
}
