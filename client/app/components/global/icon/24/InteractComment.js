import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class InteractComment extends Component {
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
        <path d="M17.5,4.5A2.50106,2.50106,0,0,1,20,7.00067h0v6.50216a2.50106,2.50106,0,0,1-2.5,2.50067h0l-3.308-.0005L8.5,21.1221V16.003l-2,.0005a2.50123,2.50123,0,0,1-2.49468-2.33631h0L4,13.50283V7.00067A2.50106,2.50106,0,0,1,6.5,4.5h11Zm0,1H6.5A1.50106,1.50106,0,0,0,5,7.00067H5v6.50216A1.50106,1.50106,0,0,0,6.5,15.0035h3V18.877l4.30824-3.8735H17.5A1.50106,1.50106,0,0,0,19,13.50283h0V7.00067A1.50106,1.50106,0,0,0,17.5,5.5Zm-1.5,6v1H8v-1Zm0-3v1H8v-1Z" />
      </svg>
    );
  }
}
