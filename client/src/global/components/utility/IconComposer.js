import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Icons from "global/components/icon";
import UniqueIcons from "global/components/icon/unique";
import endsWith from "lodash/endsWith";
import classNames from "classnames";

import humps from "humps";
import MissingIcon from "./MissingIcon";

export default class IconComposer extends PureComponent {
  static defaultProps = {
    fill: "currentColor",
    svgProps: { "aria-hidden": true }
  };

  static displayName = "IconComposer";

  static propTypes = {
    icon: PropTypes.string.isRequired,
    iconClass: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fill: PropTypes.string,
    stroke: PropTypes.string,
    svgProps: PropTypes.object
  };

  get failure() {
    return MissingIcon;
  }

  get iconComponent() {
    if (!this.props.icon) return this.failure;
    const { iconKey: key } = this;
    const source = this.iconSource(key);
    const component = source[key];
    if (!component) return this.failure;
    return component;
  }

  get iconKey() {
    if (!this.props.icon) return "";
    return humps.pascalize(this.props.icon);
  }

  iconSource(key) {
    if (endsWith(key, "Unique")) return UniqueIcons;
    return Icons;
  }

  render() {
    const { iconClass, size, fill, stroke, icon } = this.props;
    const { iconComponent: IconComponent } = this;
    const adjustedIconClass = classNames(iconClass, `svg-icon--${icon}`);

    const props = {
      svgProps: this.props.svgProps,
      iconClass: adjustedIconClass,
      icon,
      size,
      fill,
      stroke
    };
    return React.createElement(IconComponent, props);
  }
}
