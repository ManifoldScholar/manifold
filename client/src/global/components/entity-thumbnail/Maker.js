import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

export default class EntityThumbnailUser extends PureComponent {
  static displayName = "EntityThumbnail.Maker";

  static propTypes = {
    entity: PropTypes.object.isRequired,
    variant: PropTypes.string.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
    className: PropTypes.string
  };

  static defaultProps = {
    variant: "smallSquare",
    attributes: {}
  };

  get attr() {
    return this.props.entity.attributes;
  }

  get variant() {
    return this.props.variant;
  }

  get src() {
    return this.attr?.avatarStyles?.[this.variant];
  }

  get icon() {
    const { width, height, className } = this.props;
    return (
      <Utility.IconComposer
        className={className}
        svgProps={{ width, height }}
        icon="avatar64"
      />
    );
  }

  get useImage() {
    return !!this.src;
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
        loading="lazy"
      />
    );
  }

  render() {
    if (!this.useImage) return this.icon;
    return this.image;
  }
}
