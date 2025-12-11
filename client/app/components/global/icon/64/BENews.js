import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class BENews extends Component {
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
        <path d="M39.2643465,35.96065 C39.2643465,32.7727533 36.686535,30.1850285 33.5025,30.1728 L19.8809382,30.1727926 C16.693065,30.1850285 14.1152535,32.7727533 14.1152535,35.96065 C14.1152535,39.1485467 16.693065,41.7362715 19.8771,41.7485 L33.500506,41.7485 C36.6875291,41.7352734 39.2643465,39.147932 39.2643465,35.96065 Z M33.5063382,43.7484927 L19.8732617,43.7484927 C15.5838238,43.7320287 12.1152535,40.2501196 12.1152535,35.96065 C12.1152535,31.6711805 15.5838238,28.1892713 19.8771,28.1728 L33.5063382,28.1728074 C37.7957762,28.1892713 41.2643465,31.6711805 41.2643465,35.96065 C41.2643465,40.2501196 37.7957762,43.7320287 33.5063382,43.7484927 Z M4.05719996,30.1728 L4.05719996,28.1728 L43.9642,28.1728 L43.9642,30.1728 L4.05719996,30.1728 Z M55.4516752,36.7622384 C52.1544239,32.8465026 47.6524924,30.1753035 43.6628931,30.1668978 L43.6653582,28.1669001 C47.6513075,28.1683277 52.1512822,25.5008902 55.4516752,21.5832616 L59.9428,16.2515027 L59.9428,42.0939973 L55.4516752,36.7622384 Z M56.9814315,35.4738883 L57.9428,36.6152027 L57.9428,21.7302973 L56.9812826,22.8717885 C54.5951477,25.7041754 51.6260066,27.9542521 48.5521534,29.1707722 C51.6273936,30.3909571 54.5971615,32.642387 56.9814315,35.4738883 Z" />
      </svg>
    );
  }
}
