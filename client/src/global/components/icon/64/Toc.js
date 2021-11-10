import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Toc extends Component {
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
        <path d="M16.5,22.233 C18.1568542,22.233 19.5,20.8898542 19.5,19.233 C19.5,17.5761457 18.1568542,16.233 16.5,16.233 C14.8431457,16.233 13.5,17.5761457 13.5,19.233 C13.5,20.8898542 14.8431457,22.233 16.5,22.233 Z M16.5,35 C18.1568542,35 19.5,33.6568543 19.5,32 C19.5,30.3431457 18.1568542,29 16.5,29 C14.8431457,29 13.5,30.3431457 13.5,32 C13.5,33.6568543 14.8431457,35 16.5,35 Z M16.5,47.767 C18.1568542,47.767 19.5,46.4238543 19.5,44.767 C19.5,43.1101458 18.1568542,41.767 16.5,41.767 C14.8431457,41.767 13.5,43.1101458 13.5,44.767 C13.5,46.4238543 14.8431457,47.767 16.5,47.767 Z M23.5,20.233 L23.5,18.233 L50.5,18.233 L50.5,20.233 L23.5,20.233 Z M23.5,33 L23.5,31 L50.5,31 L50.5,33 L23.5,33 Z M23.5,45.767 L23.5,43.767 L50.5,43.767 L50.5,45.767 L23.5,45.767 Z" />
      </svg>
    );
  }
}
