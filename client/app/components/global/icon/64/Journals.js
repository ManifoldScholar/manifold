import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Journals extends Component {
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
        <path d="M52.996,10.004 L52.996,52 L58,52 L58,54 L6,54 L6,52 L11.004,52 L11.004,10.004 L52.996,10.004 Z M21.004,11.996 L12.996,11.996 L12.996,52 L21.004,52 L21.004,11.996 Z M31.004,11.996 L22.996,11.996 L22.996,52 L31.004,52 L31.004,11.996 Z M41.004,11.996 L32.996,11.996 L32.996,52 L41.004,52 L41.004,11.996 Z M51.004,11.996 L42.996,11.996 L42.996,52 L51.004,52 L51.004,11.996 Z M50,47 L50,49 L44,49 L44,47 L50,47 Z M40,47 L40,49 L34,49 L34,47 L40,47 Z M30,47 L30,49 L24,49 L24,47 L30,47 Z M20,47 L20,49 L14,49 L14,47 L20,47 Z M50,42 L50,44 L44,44 L44,42 L50,42 Z M40,42 L40,44 L34,44 L34,42 L40,42 Z M30,42 L30,44 L24,44 L24,42 L30,42 Z M20,42 L20,44 L14,44 L14,42 L20,42 Z M48,15 L48,33 L46,33 L46,15 L48,15 Z M38,15 L38,33 L36,33 L36,15 L38,15 Z M28,15 L28,33 L26,33 L26,15 L28,15 Z M18,15 L18,33 L16,33 L16,15 L18,15 Z" />
      </svg>
    );
  }
}
