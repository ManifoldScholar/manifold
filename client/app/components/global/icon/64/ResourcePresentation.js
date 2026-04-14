import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class ResourcePresentation extends Component {
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
        <path d="M33.9966,6.17299996 L34.9966,6.17299996 C47.6052609,6.17299996 57.8266,16.3943391 57.8266,29.003 L57.8266,30.003 L33.9966,30.003 L33.9966,6.17299996 Z M35.9966,28.003 L55.8030181,28.003 C55.296872,17.2946569 46.7049431,8.70272796 35.9966,8.19658189 L35.9966,28.003 Z M30.0034,33.9965 L51.8339,33.9965 L51.8339,34.9965 C51.8339,47.6050928 41.6126671,57.8264038 29.0040743,57.8265 C16.3954815,57.8265963 6.17409249,47.6054414 6.17389996,34.9968486 C6.17370744,22.3882558 16.3947843,12.1667888 29.0033771,12.1665 L30.0034,12.1664771 L30.0034,33.9965 Z M28.0034,35.9965 L28.0034,14.1901059 C16.9637772,14.7121704 8.17372942,23.8280387 8.17389997,34.9968181 C8.17407563,46.5008473 17.5000298,55.8265879 29.004059,55.8265 C40.1728424,55.8264148 49.288512,47.0361518 49.8103176,35.9965114 L28.0034,35.9965 Z" />
      </svg>
    );
  }
}
