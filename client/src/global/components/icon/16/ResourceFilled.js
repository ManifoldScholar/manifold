import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class ResourceFilled extends Component {
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
    return 16;
  }

  get defaultWidth() {
    return 16;
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
    return "0 0 16 16";
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
            d="M1.00015,11.8837455 L1.00015,4.78853541 L7.50015,7.90493986 L7.50015,15.00015 L1.00015,11.8837455 Z M8.49985,7.90465986 L14.99985,4.78825541 L14.99985,11.8834655 L8.49985,14.99987 L8.49985,7.90465986 Z M8.00035,0.99985 L14.40435,4.05092103 L8.00035,7.12065874 L1.59635,4.05092103 L8.00035,0.99985 Z"
          />
        </g>
      </svg>
    );
  }
}
