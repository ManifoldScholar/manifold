import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ContentBlock from "frontend/components/content-block/Block";

export default class ContentBlockList extends PureComponent {
  static displayName = "ContentBlockList";

  static propTypes = {
    entity: PropTypes.object
  };

  get entity() {
    return this.props.entity;
  }

  byAccess(blocks) {
    const authorized = this.entity.attributes.abilities.fullyRead;
    return blocks.filter(block => {
      const { access } = block.attributes;
      if (access === "always") return true;
      if (authorized) return access === "authorized";
      if (!authorized) return access === "unauthorized";
      return false;
    });
  }

  get contentBlocks() {
    return this.entity.relationships.contentBlocks || [];
  }

  get visibleContentBlocks() {
    return this.byAccess(
      this.contentBlocks.filter(block => block.attributes.visible)
    );
  }

  render() {
    return this.visibleContentBlocks.map(block => {
      return <ContentBlock key={block.id} block={block} {...this.props} />;
    });
  }
}
