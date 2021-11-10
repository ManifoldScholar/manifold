import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Search extends Component {
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
        <path d="M15.5798983,14.8766915 L19.3507534,18.6475466 L18.6436466,19.3546534 L14.8724673,15.5834741 C13.8274558,16.4672326 12.4760412,17 11,17 C7.68652629,17 5,14.3138111 5,11 C5,7.68685763 7.68685763,5 11,5 C14.3138111,5 17,7.68652629 17,11 C17,12.4780309 16.4657953,13.8310989 15.5798983,14.8766915 Z M16,11 C16,8.23878293 13.7614982,6 11,6 C8.23914237,6 6,8.23914237 6,11 C6,13.7614982 8.23878293,16 11,16 C13.7618576,16 16,13.7618576 16,11 Z" />
      </svg>
    );
  }
}
