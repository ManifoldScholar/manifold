import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Reload extends Component {
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
        <path
          fillRule="evenodd"
          d="M16.302,24.9996 C19.531,24.9996 22.361,23.2836 23.949,20.7226 L24.737,21.3496 C22.96,24.1396 19.847,25.9996 16.302,25.9996 C10.788,25.9996 6.302,21.5136 6.302,15.9996 C6.302,15.8286 6.314,15.6606 6.323,15.4926 L2.615,18.3896 L2,17.6006 L6.798,13.8536 L11.609,17.6076 L10.993,18.3966 L7.325,15.5346 C7.315,15.6886 7.302,15.8426 7.302,15.9996 C7.302,20.9626 11.339,24.9996 16.302,24.9996 Z M29.9904,13.61 L30.6054,14.399 L25.8074,18.146 L20.9974,14.391 L21.6124,13.602 L25.2784,16.464 C25.2894,16.309 25.3024,16.156 25.3024,16 C25.3024,11.037 21.2644,7 16.3024,7 C13.0724,7 10.2434,8.714 8.6554,11.276 L7.8684,10.649 C9.6444,7.859 12.7574,6 16.3024,6 C21.8154,6 26.3024,10.486 26.3024,16 C26.3024,16.171 26.2904,16.339 26.2794,16.507 L29.9904,13.61 Z"
        />
      </svg>
    );
  }
}
