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
        <path d="M21.1402461,19.4432003 L25.8583372,24.1369328 L25.1530628,24.8458672 L20.4324694,20.1496455 C19.1138812,21.3018468 17.3883877,22 15.5,22 C11.3588576,22 8,18.6411424 8,14.5 C8,10.3581919 11.3585233,7 15.5,7 C19.6421424,7 23,10.3578576 23,14.5 C23,16.3934272 22.2980724,18.1232019 21.1402461,19.4432003 Z M22,14.5 C22,10.9101424 19.0898576,8 15.5,8 C11.910786,8 9,10.9104988 9,14.5 C9,18.0888576 11.9111424,21 15.5,21 C19.0895012,21 22,18.089214 22,14.5 Z" />
      </svg>
    );
  }
}
