import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Logout extends Component {
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
    return 24;
  }

  get defaultWidth() {
    return 24;
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
    return "0 0 24 24";
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
        <path
          fillRule="evenodd"
          d="M9,17 C11.045,17 12.802,15.763 13.576,14 L14.65,14 C13.823,16.327 11.606,18 9,18 C5.691,18 3,15.309 3,12 C3,8.691 5.691,6 9,6 C11.606,6 13.824,7.674 14.65,10 L13.576,10 C12.803,8.237 11.045,7 9,7 C6.243,7 4,9.243 4,12 C4,14.757 6.243,17 9,17 Z M17.269,7.627 L21.479,12 L17.269,16.374 L16.548,15.681 L19.61,12.5 L9.5,12.5 L9.5,11.5 L19.61,11.5 L16.548,8.32 L17.269,7.627 Z"
        />
      </svg>
    );
  }
}
