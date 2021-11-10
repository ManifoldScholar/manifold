import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

export default class EntityThumbnailPage extends PureComponent {
  static displayName = "EntityThumbnail.TwitterQuery";

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
        icon="socialTwitter32"
      />
    );
  }

  render() {
    return this.icon;
  }
}
