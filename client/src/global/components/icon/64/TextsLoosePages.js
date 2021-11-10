import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class TextsLoosePages extends Component {
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
    return 64;
  }

  get defaultWidth() {
    return 64;
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
    return "0 0 64 64";
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
        <path d="M11,5.02199996 L11,51.022 L45,51.022 L45,5.02199996 L11,5.02199996 Z M47,3.02199995 L47,53.022 L8.99999996,53.022 L8.99999996,3.02199995 L47,3.02199995 Z M11,5.02199996 L11,51.022 L45,51.022 L45,5.02199996 L11,5.02199996 Z M9.99999997,4.02199996 L9.99999997,3.02199995 L47,3.02199995 L47,53.022 L8.99999996,53.022 L8.99999996,4.02199996 L9.99999997,4.02199996 Z M49,6.02199996 L51,6.02199996 L51,57.022 L12,57.022 L12,55.022 L49,55.022 L49,6.02199996 Z M49,6.02199996 L51,6.02199996 L51,57.022 L12,57.022 L12,55.022 L49,55.022 L49,6.02199996 Z M53,59.022 L53,8.02199996 L55,8.02199996 L55,61.022 L14,61.022 L14,59.022 L53,59.022 Z M53,59.022 L53,8.02199996 L55,8.02199996 L55,61.022 L14,61.022 L14,59.022 L53,59.022 Z M16.0004583,19.0219999 L15.9995416,17.0220001 L39.9995417,17.0110001 L40.0004583,19.0109999 L16.0004583,19.0219999 Z M16.0004583,29.0219999 L15.9995416,27.0220001 L39.9995417,27.0110001 L40.0004583,29.0109999 L16.0004583,29.0219999 Z M16.0004583,39.0219999 L15.9995416,37.0220001 L39.9995417,37.0110001 L40.0004583,39.0109999 L16.0004583,39.0219999 Z M16,24.022 L16,22.022 L36,22.022 L36,24.022 L16,24.022 Z M16,34.022 L16,32.022 L36,32.022 L36,34.022 L16,34.022 Z" />
      </svg>
    );
  }
}
