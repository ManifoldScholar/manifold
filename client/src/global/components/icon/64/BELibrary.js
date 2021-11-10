import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class BELibrary extends Component {
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
        <path
          fillRule="evenodd"
          d="M7,19.965 L16.506,19.965 L16.506,12.999 L7,12.999 L7,19.965 Z M7,43.111 L16.506,43.111 L16.506,21.965 L7,21.965 L7,43.111 Z M7,52.076 L16.506,52.076 L16.506,45.111 L7,45.111 L7,52.076 Z M5,54.076 L18.506,54.076 L18.506,11 L5,11 L5,54.076 Z M24,19.965 L33.506,19.965 L33.506,12.999 L24,12.999 L24,19.965 Z M24,43.111 L33.506,43.111 L33.506,21.965 L24,21.965 L24,43.111 Z M24,52.076 L33.506,52.076 L33.506,45.111 L24,45.111 L24,52.076 Z M22,54.076 L35.506,54.076 L35.506,11 L22,11 L22,54.076 Z M46.467,44.518 L55.849,42.988 L56.971,49.862 L47.589,51.393 L46.467,44.518 Z M50.678,11.295 L51.8,18.17 L42.417,19.7 L41.296,12.826 L50.678,11.295 Z M55.527,41.013 L46.145,42.543 L42.739,21.674 L52.122,20.145 L55.527,41.013 Z M52.329,9 L39,11.173 L45.937,53.689 L59.267,51.514 L52.329,9 Z"
        />
      </svg>
    );
  }
}
