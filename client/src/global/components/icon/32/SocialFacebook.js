import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class SocialFacebook extends Component {
  static propTypes = {
    className: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stroke: PropTypes.string,
    fill: PropTypes.string,
    svgProps: PropTypes.object
  };

  static defaultProps = {
    className: "",
    size: "inherit",
    stroke: "currentColor",
    fill: "currentColor",
    svgProps: {}
  };

  get defaultHeight() {
    return 32;
  }

  get defaultWidth() {
    return 32;
  }

  get size() {
    return this.props.size;
  }

  get width() {
    if (this.size === null || this.size === "inherit") return null;
    if (this.size === "default") return this.defaultWidth;
    return this.size;
  }

  get height() {
    if (this.size === null || this.size === "inherit") return null;
    if (this.size === "default") return this.defaultHeight;
    return this.size;
  }

  get viewBox() {
    return "0 0 32 32";
  }

  get classes() {
    const { className } = this.props;
    return classnames("manicon-svg", className);
  }

  get fill() {
    return this.props.fill;
  }

  get stroke() {
    return this.props.stroke;
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
        <path d="M18.1678,30 L18.1678,17.2279 L22.4549,17.2279 L23.0968,12.2503 L18.1678,12.2503 L18.1678,9.07239998 C18.1678,7.63129997 18.5678,6.64919997 20.6346,6.64919997 L23.27,6.64799997 L23.27,2.19609996 C21.9945188,2.06094811 20.7126138,1.99548416 19.43,1.99999996 C15.63,1.99999996 13.0281,4.31999996 13.0281,8.57999998 L13.0281,12.25 L8.72999998,12.25 L8.72999998,17.2276 L13.0281,17.2276 L13.0281,30 L18.1678,30 Z" />
      </svg>
    );
  }
}
