import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

export default class EntityThumbnailTextSection extends PureComponent {
  static defaultProps = {
    variant: "smallPortrait"
  };

  static displayName = "EntityThumbnail.TextSection";

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
        icon="resourceDocument64"
      />
    );
  }

  get image() {
    return null;
  }

  get src() {
    return false; // we don't have icons for these yet.
  }

  get useImage() {
    return false;
  }

  get variant() {
    return this.props.variant;
  }

  render() {
    if (!this.useImage) return this.icon;
    return this.image;
  }
}
