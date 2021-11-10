import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Speaker extends Component {
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
      viewBox: this.viewBox
    };

    const svgProps = Object.assign(baseSvgProps, this.props.svgProps);

    return (
      <svg {...svgProps}>
        <g fill="none" fillRule="evenodd">
          <path
            fill={this.fill}
            d="M5.935,9.333 L11.965,4 L11.965,19.755 L5.935,14.422 L2,14.422 L2,9.333 L5.935,9.333 Z M17.7651,11.4818 C17.7651,13.6008 16.6501,15.4608 14.9801,16.5178 L13.6551,15.7128 C15.2831,14.9978 16.4211,13.3718 16.4211,11.4818 C16.4211,9.7928 15.5091,8.3178 14.1521,7.5108 L15.3801,6.7248 C16.8251,7.8128 17.7651,9.5378 17.7651,11.4818 Z M22.0483,11.4818 C22.0483,14.3918 20.8213,17.0168 18.8673,18.8818 L17.6743,18.1578 C19.5303,16.5248 20.7073,14.1408 20.7073,11.4818 C20.7073,8.9628 19.6503,6.6888 17.9623,5.0678 L19.1203,4.3258 C20.9283,6.1748 22.0483,8.6988 22.0483,11.4818 Z"
          />
        </g>
      </svg>
    );
  }
}
