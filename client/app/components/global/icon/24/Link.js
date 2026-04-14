import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Link extends Component {
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

    const { title, ...restProps } = this.props.svgProps;

    const svgProps = Object.assign(baseSvgProps, restProps);

    return (
      <svg {...svgProps}>
        {title && <title>{title}</title>}
        <path
          fill={this.fill}
          d="M15.9993,19.0001 L15.9993,13.0591 L16.9993,13.0591 L16.9993,20.0001 L3.9993,20.0001 L3.9993,7.0001 L10.9993,7.0001 L10.9993,8.0001 L4.9993,8.0001 L4.9993,19.0001 L15.9993,19.0001 Z M11.9993,4.0001 L19.9993,4.0001 L19.9993,12.0001 L18.9993,12.0001 L18.9993,5.7071 L10.8533,13.8541 L10.1453,13.1461 L18.2923,5.0001 L11.9993,5.0001 L11.9993,4.0001 Z"
        />
      </svg>
    );
  }
}
