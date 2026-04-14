import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class CircleMinus extends Component {
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
        <path d="M9.99999998,16.5 L9.99999998,15.5 L22,15.5 L22,16.5 L9.99999998,16.5 Z M16,27 C9.92486773,27 4.99999997,22.0751323 4.99999997,16 C4.99999997,9.92486773 9.92486773,4.99999997 16,4.99999997 C22.0751323,4.99999997 27,9.92486773 27,16 C27,22.0751323 22.0751323,27 16,27 Z M16,26 C21.5228475,26 26,21.5228475 26,16 C26,10.4771525 21.5228475,5.99999997 16,5.99999997 C10.4771525,5.99999997 5.99999997,10.4771525 5.99999997,16 C5.99999997,21.5228475 10.4771525,26 16,26 Z" />
      </svg>
    );
  }
}
