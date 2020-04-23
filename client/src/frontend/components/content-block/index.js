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

  byAccess(blocks) {
    const authorized = this.project.attributes.abilities.fullyRead;
    return blocks.filter(block => {
      const { access } = block.attributes;
      if (access === "always") return true;
      if (authorized) return access === "authorized";
      if (!authorized) return access === "unauthorized";
      return false;
    });
  }

  get contentBlocks() {
    return this.project.relationships.contentBlocks || [];
  }

  get visibleContentBlocks() {
    return this.byAccess(
      this.contentBlocks.filter(block => block.attributes.visible)
    );
  }

  render() {
    return this.visibleContentBlocks.map(block => {
      return <Block block={block} key={block.id} project={this.project} />;
    });
  }
}
