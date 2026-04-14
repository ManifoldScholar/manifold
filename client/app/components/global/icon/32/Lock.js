import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Lock extends Component {
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
      viewBox: this.viewBox,
      fill: this.fill
    };

    const svgProps = Object.assign(baseSvgProps, this.props.svgProps);

    return (
      <svg {...svgProps}>
        <path d="M9.43739998,14.2583 L9.43739998,24.5338 L22.5625,24.5338 L22.5625,14.2583 L9.43739998,14.2583 Z M23.5625,13.2583 L23.5625,25.5338 L8.43739998,25.5338 L8.43739998,13.2583 L23.5625,13.2583 Z M12.3263,13.9377 L11.3263,13.9377 L11.3263,10.3514 C11.3263,8.20566327 13.0657633,6.46619997 15.2115,6.46619997 L16.7885,6.46619997 C17.8189191,6.46619997 18.8071349,6.87553237 19.5357513,7.60414871 C20.2643676,8.33276505 20.6737,9.32098087 20.6737,10.3514 L20.6737,13.9377 L19.6737,13.9377 L19.6737,10.3514 C19.6737,9.58619736 19.3697245,8.85233545 18.8286445,8.31125549 C18.2875645,7.77017553 17.5537026,7.46619997 16.7885,7.46619997 L15.2115,7.46619997 C13.618048,7.46619997 12.3263,8.75794802 12.3263,10.3514 L12.3263,13.9377 Z" />
      </svg>
    );
  }
}
