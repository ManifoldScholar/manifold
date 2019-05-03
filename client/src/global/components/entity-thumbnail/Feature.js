import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

export default class EntityThumbnailFeature extends PureComponent {
  static defaultProps = {
    attributes: {}
  };

  static displayName = "EntityThumbnail.Feature";

  static propTypes = {
    entity: PropTypes.object.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
    className: PropTypes.string
  };

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

  render() {
    return this.icon;
  }
}
