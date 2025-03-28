import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class ResourceVideo extends Component {
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
          d="M56.011,7 L5,17.095 L7.116,27.791 L7.116,57.147 L59.116,57.147 L59.116,27.147 L16.019,27.147 L58.339,18.772 L56.011,7 Z M52.924,9.649 L54.436,9.349 L55.99,17.198 L49.168,18.549 L52.924,9.649 Z M43.771,11.46 L50.555,10.118 L46.799,19.017 L40.015,20.36 L43.771,11.46 Z M34.621,13.271 L41.404,11.929 L37.647,20.828 L30.864,22.17 L34.621,13.271 Z M25.469,15.084 L32.253,13.74 L28.496,22.639 L21.713,23.982 L25.469,15.084 Z M16.317,16.894 L23.101,15.552 L19.345,24.451 L12.562,25.794 L16.317,16.894 Z M7.35,18.669 L13.949,17.363 L10.193,26.263 L8.903,26.517 L7.35,18.669 Z M9.116,55.147 L57.116,55.147 L57.116,29.147 L9.116,29.147 L9.116,55.147 Z M29.1112,37.4049 L36.1762,41.6429 L29.1112,45.8809 L29.1112,37.4049 Z M27.1112,33.8739 L27.1112,49.4119 L40.0652,41.6429 L27.1112,33.8739 Z"
        />
      </svg>
    );
  }
}
