import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

export default class EntityThumbnailResource extends PureComponent {
  static displayName = "EntityThumbnail.ResourceCollection";

  static propTypes = {
    entity: PropTypes.object.isRequired,
    variant: PropTypes.string.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
    className: PropTypes.string
  };

  static defaultProps = {
    variant: "smallLandscape",
    attributes: {}
  };

  get attr() {
    return this.props.entity.attributes;
  }

  get variant() {
    return this.props.variant;
  }

  get src() {
    if (!this.attr.thumbnailStyles) return null;
    return this.attr.thumbnailStyles[this.variant];
  }

  get kind() {
    return this.attr.kind;
  }

  get icon() {
    const { width, height, className } = this.props;
    return (
      <Utility.IconComposer
        className={className}
        svgProps={{ width, height }}
        icon="resourceCollection64"
      />
    );
  }

  get useImage() {
    return !!this.src;
  }

  get altText() {
    return this.attr.thumbnailAltText;
  }

  get image() {
    const { width, height, className } = this.props;
    return (
      <img
        alt={this.altText ?? ""}
        src={this.src}
        width={width}
        height={height}
        className={className}
        loading="lazy"
      />
    );
  }

  render() {
    if (!this.useImage) return this.icon;
    return this.image;
  }
}
