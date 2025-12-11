import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class TimerClock extends Component {
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
        <path d="M16,4.5 C9.64782988,4.5 4.5,9.64856403 4.5,16 C4.5,22.3529384 9.64706159,27.5 16,27.5 C22.351436,27.5 27.5,22.3521701 27.5,16 C27.5,9.64933244 22.3506676,4.5 16,4.5 Z M16,5.5 C21.7983828,5.5 26.5,10.2016172 26.5,16 C26.5,21.7998534 21.7991831,26.5 16,26.5 C10.1993463,26.5 5.5,21.8006537 5.5,16 C5.5,10.2008169 10.2001466,5.5 16,5.5 Z M17.4729521,9.81421261 L18.4013551,10.1857874 L15.981,16.234 L23.9024272,18.9028523 L23.5832108,19.8505341 L14.6591905,16.8445735 L17.4729521,9.81421261 Z" />
      </svg>
    );
  }
}
