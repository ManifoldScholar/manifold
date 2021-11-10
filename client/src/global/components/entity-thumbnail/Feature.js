import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

export default class EntityThumbnailFeature extends PureComponent {
  static displayName = "EntityThumbnail.Feature";

  static propTypes = {
    entity: PropTypes.object.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
    className: PropTypes.string
  };

  static defaultProps = {
    attributes: {}
  };

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

  render() {
    return this.icon;
  }
}
