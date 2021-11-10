import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

export default class EntityThumbnailTextSection extends PureComponent {
  static displayName = "EntityThumbnail.TextSection";

  static propTypes = {
    entity: PropTypes.object.isRequired,
    variant: PropTypes.string.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
    className: PropTypes.string
  };

  static defaultProps = {
    variant: "smallPortrait"
  };

  get attr() {
    return this.props.entity.attributes;
  }

  get variant() {
    return this.props.variant;
  }

  get src() {
    return false; // we don't have icons for these yet.
  }

  get icon() {
    const { width, height, className } = this.props;
    return (
      <Utility.IconComposer
        className={className}
        svgProps={{ width, height }}
        icon="resourceDocument64"
      />
    );
  }

  get useImage() {
    return false;
  }

  get image() {
    return null;
  }

  render() {
    if (!this.useImage) return this.icon;
    return this.image;
  }
}
