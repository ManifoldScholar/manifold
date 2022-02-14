import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ContentBlock from "frontend/components/content-block/Block";

export default class ContentBlockList extends PureComponent {
  static displayName = "ContentBlockList";

  static propTypes = {
    entity: PropTypes.object,
    hideHeader: PropTypes.oneOfType([PropTypes.bool, PropTypes.array])
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
      this.contentBlocks.filter(block => block.attributes?.visible)
    );
  }

  getHeader(block) {
    if (typeof this.props.hideHeader === "boolean")
      return this.props.hideHeader;
    if (Array.isArray(this.props.hideHeader))
      return this.props.hideHeader.includes(block.type);
    return false;
  }

  render() {
    return this.visibleContentBlocks.map(block => {
      return (
        <ContentBlock
          key={block.id}
          block={block}
          {...this.props}
          hideHeader={this.getHeader(block)}
        />
      );
    });
  }
}
