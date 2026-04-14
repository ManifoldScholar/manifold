import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class SocialCite extends Component {
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
        <path d="M2.99999996,14.59 C2.99999996,22.1751 7.33859997,26 14,26 L14,21.9918 C11.9188,21.9918 9.12559998,21.7804 9.12559998,17.2936 L14,17.2936 L14,5.99999997 L2.99999996,5.99999997 L2.99999996,14.59 Z M29,5.99999997 L18,5.99999997 L18,14.59 C18,22.1751 22.3386,26 29,26 L29,21.9918 C26.9188,21.9918 24.1256,21.7804 24.1256,17.2936 L29,17.2936 L29,5.99999997 Z" />
      </svg>
    );
  }
}
