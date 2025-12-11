import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class CommentPost extends Component {
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
            d="M9.5,22.9824561 L4,22.9824561 L4,4 L28,4 L28,22.9824561 L16.0161821,22.9824561 L9.5,29.3843192 L9.5,22.9824561 Z M27,21.9824561 L27,5 L5,5 L5,21.9824561 L10.5,21.9824561 L10.5,27 L15.6071429,21.9824561 L27,21.9824561 Z M23,9 L23,10 L9,10 L9,9 L23,9 Z M23,13 L23,14 L9,14 L9,13 L23,13 Z M23,17 L23,18 L9,18 L9,17 L23,17 Z"
          />
        </g>
      </svg>
    );
  }
}
