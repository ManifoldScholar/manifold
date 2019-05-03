import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Comment extends Component {
  static defaultProps = {
    iconClass: "",
    size: "inherit",
    stroke: "currentColor",
    fill: "currentColor",
    svgProps: {}
  };

  static propTypes = {
    iconClass: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stroke: PropTypes.string,
    fill: PropTypes.string,
    svgProps: PropTypes.object
  };

  get classes() {
    const { iconClass } = this.props;
    return classnames("manicon-svg", iconClass);
  }

  get defaultHeight() {
    return 32;
  }

  get defaultWidth() {
    return 32;
  }

  get fill() {
    return this.props.fill;
  }

  get height() {
    if (this.size === null || this.size === "inherit") return null;
    if (this.size === "default") return this.defaultHeight;
    return this.size;
  }

  get size() {
    return this.props.size;
  }

  get stroke() {
    return this.props.stroke;
  }

  get viewBox() {
    return "0 0 32 32";
  }

  get width() {
    if (this.size === null || this.size === "inherit") return null;
    if (this.size === "default") return this.defaultWidth;
    return this.size;
  }

  render() {
    const baseSvgProps = {
      xmlns: "http://www.w3.org/2000/svg",
      className: this.classes,
      width: this.width,
      height: this.height,
      viewBox: this.viewBox,
      fill: this.fill
    };

    const svgProps = Object.assign(baseSvgProps, this.props.svgProps);

    return (
      <svg {...svgProps}>
        <path d="M12.109,20.319 L5.99999997,20.319 L5.99999997,7.00999997 L26,7.00999997 L26,20.319 L18.8529849,20.319 L12.109,26.9658287 L12.109,20.319 Z M25,8.00999998 L6.99999997,8.00999998 L6.99999997,19.319 L13.109,19.319 L13.109,24.5761714 L18.4430151,19.319 L25,19.319 L25,8.00999998 Z" />
      </svg>
    );
  }
}
