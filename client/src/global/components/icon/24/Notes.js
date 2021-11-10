import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Notes extends Component {
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
        <path d="M4.99999997,4.99999997 L4.99999997,17.9856 C4.99999997,19.0981224 5.90187757,20 7.01439998,20 L16.9856,20 C18.0981224,20 19,19.0981224 19,17.9856 L19,4.99999997 L4.99999997,4.99999997 Z M20,3.99999997 L20,17.9856 C20,19.6504072 18.6504072,21 16.9856,21 L7.01439998,21 C5.34959282,21 3.99999997,19.6504072 3.99999997,17.9856 L3.99999997,3.99999997 L20,3.99999997 Z M8.49999999,6.99999998 L7.49999998,6.99999998 L7.49999998,1.99999996 L8.49999999,1.99999996 L8.49999999,6.99999998 Z M12.5,6.99999998 L11.5,6.99999998 L11.5,1.99999996 L12.5,1.99999996 L12.5,6.99999998 Z M16.5,6.99999998 L15.5,6.99999998 L15.5,1.99999996 L16.5,1.99999996 L16.5,6.99999998 Z M16,16 L16,17 L7.99999998,17 L7.99999998,16 L16,16 Z M14,13 L14,14 L7.99999998,14 L7.99999998,13 L14,13 Z M16,9.99999999 L16,11 L7.99999998,11 L7.99999998,9.99999999 L16,9.99999999 Z" />
      </svg>
    );
  }
}
