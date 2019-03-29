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

  get src() {
    if (!this.attr.avatarStyles) return null;
    const meta = this.attr.avatarMeta ? this.attr.avatarMeta.original : null;
    const style = meta && meta.width >= meta.height ? "smallSquare" : "small";
    return this.attr.avatarStyles[style];
  }

  get icon() {
    return (
      <UniqueIcons.ProjectPlaceholderUnique
        mode={this.props.mode}
        color={this.attr.avatarColor}
        {...this.props.placeholderAttributes}
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
      />
    );
  }

  render() {
    if (!this.useImage) return this.icon;
    return this.image;
  }
}
