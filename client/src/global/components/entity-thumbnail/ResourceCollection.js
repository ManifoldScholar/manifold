import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

export default class EntityThumbnailResource extends PureComponent {
  static defaultProps = {
    variant: "smallLandscape",
    attributes: {}
  };

  static displayName = "EntityThumbnail.ResourceCollection";

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
    const { width, height, className } = this.props;
    return (
      <Utility.IconComposer
        iconClass={className}
        svgProps={{ width, height }}
        icon="resourceCollection64"
      />
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
    if (!this.attr.thumbnailStyles) return null;
    return this.attr.thumbnailStyles[this.variant];
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
