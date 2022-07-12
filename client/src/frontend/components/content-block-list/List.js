import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ContentBlock from "frontend/components/content-block/Block";

export default class ContentBlockList extends PureComponent {
  static displayName = "ContentBlockList";

  static propTypes = {
    entity: PropTypes.object,
    hideHeader: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
    hideDefaultHeader: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
    hideLastBottomBorder: PropTypes.bool
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

  hideHeader(block, hideProp = "hideHeader") {
    if (typeof this.props[hideProp] === "boolean") return this.props[hideProp];
    if (Array.isArray(this.props[hideProp]))
      return this.props[hideProp].includes(block.type);
    return false;
  }

  render() {
    const { hideHeader, hideLastBottomBorder, ...restProps } = this.props;

    return this.visibleContentBlocks.map((block, index) => {
      return (
        <ContentBlock
          key={block.id}
          block={block}
          {...restProps}
          hideHeader={this.hideHeader(block)}
          hideDefaultHeader={this.hideHeader(block, "hideDefaultHeader")}
          hideBottomBorder={
            this.props.hideLastBottomBorder &&
            index === this.visibleContentBlocks.length - 1
          }
        />
      );
    });
  }
}
