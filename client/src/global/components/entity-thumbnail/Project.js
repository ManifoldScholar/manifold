import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import UniqueIcons from "global/components/icon/unique";

export default class EntityThumbnailProject extends PureComponent {
  static displayName = "EntityThumbnail.Project";

  static propTypes = {
    entity: PropTypes.object.isRequired,
    variant: PropTypes.string.isRequired,
    placeholderAttributes: PropTypes.object.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
    className: PropTypes.string,
    mode: PropTypes.string
  };

  static defaultProps = {
    mode: "responsive",
    variant: "small",
    attributes: {},
    placeholderAttributes: {}
  };

  get attr() {
    return this.props.entity.attributes;
  }

  get variant() {
    return this.props.variant;
  }

  get avatarStyle() {
    if (!this.attr.avatarStyles) return null;
    const meta = this.attr.avatarMeta ? this.attr.avatarMeta.original : null;
    return meta && meta.width >= meta.height ? "smallSquare" : "small";
  }

  get src() {
    if (!this.avatarStyle) return null;
    return this.attr.avatarStyles[this.avatarStyle];
  }

  get width() {
    if (this.props.width) return this.props.width;
    return this.attr.avatarMeta[this.avatarStyle]?.width;
  }

  get height() {
    if (this.props.height) return this.props.height;
    return this.attr.avatarMeta[this.avatarStyle]?.height;
  }

  get alt() {
    return this.attr.avatarAltText;
  }

  get icon() {
    return (
      <UniqueIcons.ProjectPlaceholderUnique
        mode={this.props.mode}
        color={this.attr.avatarColor}
        {...this.props.placeholderAttributes}
        className={this.props.className}
      />
    );
  }

  get useImage() {
    return !!this.src;
  }

  get image() {
    return (
      <img
        alt={this.alt ?? ""}
        src={this.src}
        width={this.width}
        height={this.height}
        className={this.props.className}
        loading="lazy"
      />
    );
  }

  render() {
    if (!this.useImage) return this.icon;
    return this.image;
  }
}
