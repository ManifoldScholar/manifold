import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class AnnotationGroup extends Component {
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
            d="M2,3 L2,13 L5,13 L5,17.046 L9.478,13 L16,13 L16,3 L2,3 Z M3,4 L15,4 L15,12 L9.093,12 L6,14.794 L6,12 L3,12 L3,4 Z M17.5003,7.9995 L21.9993,7.9995 L21.9993,16.9995 L19.0003,16.9995 L19.0003,21.2575 L14.8993,16.9995 L10.0003,16.9995 L10.0003,14.4995 L11.0003,14.4995 L11.0003,15.9995 L15.3253,15.9995 L18.0003,18.7775 L18.0003,15.9995 L21.0003,15.9995 L21.0003,8.9995 L17.5003,8.9995 L17.5003,7.9995 Z"
          />
        </g>
      </svg>
    );
  }
}
