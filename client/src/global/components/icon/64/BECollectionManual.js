import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class BECollectionManual extends Component {
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
        <path d="M33.0042,49.9968 L31.0042,49.9968 L31.0042,37.6356 L33.0042,37.6356 L33.0042,49.9968 Z M38.1758,42.8162 L38.1758,44.8162 L25.8326,44.8162 L25.8326,42.8162 L38.1758,42.8162 Z M9.99999997,46.833 L15.017,46.833 L15.017,48.833 L7.99999996,48.833 L7.99999996,19.723 L56,19.723 L56,48.833 L48.983,48.833 L48.983,46.833 L54,46.833 L54,21.723 L9.99999997,21.723 L9.99999997,46.833 Z M13.0112,15.6977 L13.0112,13.6977 L50.9888,13.6977 L50.9888,15.6977 L13.0112,15.6977 Z M17.0224,9.67219997 L17.0224,7.67219996 L46.9776,7.67219996 L46.9776,9.67219997 L17.0224,9.67219997 Z M31.878,56.3278 C24.976932,56.3278 19.3831,50.7258412 19.3831,43.8162 C19.3831,36.9065589 24.976932,31.3046 31.878,31.3046 C38.779068,31.3046 44.3729,36.9065589 44.3729,43.8162 C44.3729,50.7258412 38.779068,56.3278 31.878,56.3278 Z M31.878,54.3278 C37.673848,54.3278 42.3729,49.6219211 42.3729,43.8162 C42.3729,38.0104789 37.673848,33.3046 31.878,33.3046 C26.082152,33.3046 21.3831,38.0104789 21.3831,43.8162 C21.3831,49.6219211 26.082152,54.3278 31.878,54.3278 Z" />
      </svg>
    );
  }
}
