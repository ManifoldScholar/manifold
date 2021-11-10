import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class ManifoldLogo extends Component {
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
        <polygon
          fillRule="evenodd"
          points="29.995 10.305 27.851 10.983 24.581 9.72 29.995 8.007 29.995 6.182 21.983 8.718 18.712 7.454 29.995 3.884 29.995 2.059 16.114 6.45 2 1 2.036 12.73 15.131 8.587 15.131 10.886 2.036 15.029 2.036 16.854 15.131 12.71 15.131 15.009 2.036 19.152 2.036 20.977 15.131 16.834 15.131 19.132 2.036 23.275 2.036 25.1 15.131 20.958 15.131 23.256 2.036 27.399 2.036 29.224 15.989 24.809 30 30.22"
        />
      </svg>
    );
  }
}
