import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Icon } from "components/global/SVG";
import humps from "humps";

export default class IconComposer extends PureComponent {
  static displayName = "IconComposer";

  static propTypes = {
    icon: PropTypes.string.isRequired,
    iconClass: PropTypes.string,
    size: PropTypes.number,
    fill: PropTypes.string,
    stroke: PropTypes.string
  };

  static defaultProps = {
    fill: "currentColor"
  };

  render() {
    const { icon, iconClass, size, fill, stroke } = this.props;
    const IconComponent = Icon[humps.pascalize(icon)];

    return React.createElement(IconComponent, {
      iconClass,
      size,
      fill,
      stroke
    });
  }
}
