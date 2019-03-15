import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class ActivityResource extends Component {
  static propTypes = {
    iconClass: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stroke: PropTypes.string,
    fill: PropTypes.string,
    svgProps: PropTypes.object
  };

  static defaultProps = {
    iconClass: "",
    size: "inherit",
    stroke: "currentColor",
    fill: "currentColor",
    svgProps: {}
  };

  get defaultHeight() {
    return 48;
  }

  get defaultWidth() {
    return 48;
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
    return "0 0 48 48";
  }

  get classes() {
    const { iconClass } = this.props;
    return classnames("manicon-svg", iconClass);
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
            d="M47,24 C47,36.7027083 36.7027083,47 24,47 C11.2972917,47 1,36.7027083 1,24 C1,11.2972917 11.2972917,1 24,1 C36.7027083,1 47,11.2972917 47,24 M24.014,7.002 L23.014,7 L23,12.357 L24,12.359 L24.014,7.002 Z M18.386,13.652 L15.881,9 L15,9.474 L17.505,14.127 L18.386,13.652 Z M9.554,15 L9,15.832 L13.241,18.653 L13.794,17.821 L9.554,15 Z M37.129,14 L33,16.985 L33.586,17.796 L37.715,14.811 L37.129,14 Z M32.225,9.439 L31.327,9 L29,13.747 L29.898,14.186 L32.225,9.439 Z M24.5,38.519 L24.5,28.065 L33,23.472 L33,33.927 L24.5,38.519 Z M15,23.472 L23.5,28.065 L23.5,38.519 L15,33.927 L15,23.472 Z M32.415,22.653 L24,27.199 L15.585,22.653 L24,18.135 L32.415,22.653 Z M14,22.369 L14,34.523 L24,39.926 L34,34.523 L34,22.369 L24,17 L14,22.369 Z"
          />
          <path
            fill={this.fill}
            d="M47,24 C47,36.7027083 36.7027083,47 24,47 C11.2972917,47 1,36.7027083 1,24 C1,11.2972917 11.2972917,1 24,1 C36.7027083,1 47,11.2972917 47,24 M24.014,7.002 L23.014,7 L23,12.357 L24,12.359 L24.014,7.002 Z M18.386,13.652 L15.881,9 L15,9.474 L17.505,14.127 L18.386,13.652 Z M9.554,15 L9,15.832 L13.241,18.653 L13.794,17.821 L9.554,15 Z M37.129,14 L33,16.985 L33.586,17.796 L37.715,14.811 L37.129,14 Z M32.225,9.439 L31.327,9 L29,13.747 L29.898,14.186 L32.225,9.439 Z M24.5,38.519 L24.5,28.065 L33,23.472 L33,33.927 L24.5,38.519 Z M15,23.472 L23.5,28.065 L23.5,38.519 L15,33.927 L15,23.472 Z M32.415,22.653 L24,27.199 L15.585,22.653 L24,18.135 L32.415,22.653 Z M14,22.369 L14,34.523 L24,39.926 L34,34.523 L34,22.369 L24,17 L14,22.369 Z"
          />
        </g>
      </svg>
    );
  }
}
