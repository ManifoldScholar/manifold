import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class ActivityComments extends Component {
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
          d="M64,32A32,32,0,1,1,32,0,31.99977,31.99977,0,0,1,64,32M46.45161,43.3569H42.39794l-.4831-2.99561a4.94494,4.94494,0,0,0-4.85368-4.23019H26.92852a4.94255,4.94255,0,0,0-4.85368,4.23019l-.4831,2.99561H17.54839V18.58271H46.45161Zm-9.20877,0-8.33961,7.28671V43.3569H23.6831l.42942-2.66838a2.88877,2.88877,0,0,1,2.816-2.49291H37.06116a2.88959,2.88959,0,0,1,2.816,2.49394l.42942,2.66735Zm-21.759-26.83871V45.42142H26.83871v9.76619L38.017,45.42142h10.4991V16.51819ZM32,23.744a4.129,4.129,0,1,1-4.129,4.129A4.13319,4.13319,0,0,1,32,23.744m0,10.32258A6.19355,6.19355,0,1,0,25.80645,27.873,6.19978,6.19978,0,0,0,32,34.06658"
        />
      </svg>
    );
  }
}
