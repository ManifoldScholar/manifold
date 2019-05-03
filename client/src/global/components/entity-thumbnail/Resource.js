import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import IconComputed from "global/components/icon-computed";

export default class EntityThumbnailResource extends PureComponent {
  static defaultProps = {
    variant: "small",
    attributes: {}
  };

  static displayName = "EntityThumbnail.Resource";

  static propTypes = {
    entity: PropTypes.object.isRequired,
    variant: PropTypes.string.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
    className: PropTypes.string
  };

  get attr() {
    return this.props.entity.attributes;
  }

  get icon() {
    const { width, height } = this.props;
    return (
      <IconComputed.Resource svgProps={{ width, height }} icon={this.kind} />
    );
  }

  get image() {
    const { width, height, className } = this.props;
    return (
      <img
        alt=""
        src={this.src}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  get kind() {
    return this.attr.kind;
  }

  get src() {
    const a = this.attr.variantThumbnailStyles
      ? this.attr.variantThumbnailStyles[this.variant]
      : null;
    const b = this.attr.attachmentStyles
      ? this.attr.attachmentStyles[this.variant]
      : null;
    return a || b;
  }

  get useImage() {
    return !!this.src;
  }

  get variant() {
    return this.props.variant;
  }

  render() {
    if (!this.useImage) return this.icon;
    return this.image;
  }
}
