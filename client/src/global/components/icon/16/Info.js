import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Info extends Component {
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
      viewBox: this.viewBox,
      fill: this.fill
    };

    const svgProps = Object.assign(baseSvgProps, this.props.svgProps);

    return (
      <svg {...svgProps}>
        <path d="M8,15 C4.13372014,15 1,11.8662799 1,8 C1,4.13432793 4.13402421,1 8,1 C11.8659758,1 15,4.13432793 15,8 C15,11.8662799 11.8662799,15 8,15 Z M8,14 C11.3139951,14 14,11.3139951 14,8 C14,4.68659099 11.3136693,2 8,2 C4.68633066,2 2,4.68659099 2,8 C2,11.3139951 4.68600489,14 8,14 Z M7.5001,11.4999 L7.5001,7.4999 L8.5001,7.4999 L8.5001,11.4999 L7.5001,11.4999 Z M8.0001,6.4999 C7.44757899,6.4999 7.0001,6.05113489 7.0001,5.49937451 C7.0001,4.94656316 7.44757899,4.4999 8.0001,4.4999 C8.55262101,4.4999 9.0001,4.94656316 9.0001,5.49937451 C9.0001,6.05113489 8.55262101,6.4999 8.0001,6.4999 Z" />
      </svg>
    );
  }
}
