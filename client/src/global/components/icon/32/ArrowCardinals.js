import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class ArrowCardinals extends Component {
  static propTypes = {
    className: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stroke: PropTypes.string,
    fill: PropTypes.string,
    svgProps: PropTypes.object,
  };

  static defaultProps = {
    className: "",
    size: "inherit",
    stroke: "currentColor",
    fill: "currentColor",
    svgProps: {},
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
      fill: this.fill,
    };

    const svgProps = Object.assign(baseSvgProps, this.props.svgProps);

    return (
      <svg {...svgProps}>
        <polygon points="18.85 22 16.5 24.38 16.5 21.3 16.5 10.7 16.5 7.62 18.87 10.02 19.58 9.32 16 5.7 12.41 9.33 13.12 10.03 15.5 7.62 15.5 10.7 15.5 21.3 15.5 24.38 13.14 21.99 12.43 22.69 16 26.3 19.56 22.7 18.85 22" />
        <polygon points="10 18.86 7.61 16.51 10.69 16.51 21.29 16.51 24.37 16.51 21.97 18.88 22.67 19.59 26.29 16.01 22.67 12.41 21.97 13.12 24.37 15.51 21.29 15.51 10.69 15.51 7.61 15.51 10.01 13.14 9.31 12.43 5.69 16.01 9.3 19.57 10 18.86" />
      </svg>
    );
  }
}
