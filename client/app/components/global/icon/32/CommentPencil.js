import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class CommentPencil extends Component {
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
      viewBox: this.viewBox
    };

    const svgProps = Object.assign(baseSvgProps, this.props.svgProps);

    return (
      <svg {...svgProps}>
        <g fill="none" fillRule="evenodd">
          <path
            fill={this.fill}
            fillRule="nonzero"
            d="M30.4221932,14.9873 L30.4221932,18.2023 C30.4221932,19.4714424 29.3933356,20.5003 28.1241932,20.5003 L24.4221932,20.5003 L24.4221932,12.5003 L27.9351932,12.5003 C29.3043356,12.5003 30.4221932,13.6181576 30.4221932,14.9873 Z M28.1241932,19.5003 C28.8410508,19.5003 29.4221932,18.9191576 29.4221932,18.2023 L29.4221932,14.9873 C29.4221932,14.1704424 28.7520508,13.5003 27.9351932,13.5003 L25.4221932,13.5003 L25.4221932,19.5003 L28.1241932,19.5003 Z M6.42219321,19.4567941 L6.42219321,13.5432059 L1.84338641,16.5 L6.42219321,19.4567941 Z M7.42219321,19.5 L24.4426932,19.5 L24.4426932,20.5 L6.19428571,20.5 L-3.73034936e-14,16.5 L6.19428571,12.5 L24.4426932,12.5 L24.4426932,13.5 L7.42219321,13.5 L7.42219321,19.5 Z M22.4221932,16 L22.4221932,17 L9.42219321,17 L9.42219321,16 L22.4221932,16 Z"
            transform="rotate(-45 15.211 16.5)"
          />
        </g>
      </svg>
    );
  }
}
