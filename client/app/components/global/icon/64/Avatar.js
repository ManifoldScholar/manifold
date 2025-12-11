import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Avatar extends Component {
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
          d="M48.204,49.686 L48.109,49.118 C47.436,45.082 43.979,42.153 39.889,42.153 L24.108,42.153 C20.017,42.153 16.56,45.082 15.889,49.118 L15.794,49.684 C11.007,45.294 8,38.993 8,32 C8,18.767 18.767,8 32,8 C45.233,8 56,18.767 56,32 C56,38.994 52.992,45.295 48.204,49.686 M17.574,51.167 L17.861,49.446 C18.372,46.379 20.999,44.153 24.108,44.153 L39.889,44.153 C42.997,44.153 45.625,46.379 46.137,49.446 L46.424,51.168 C42.405,54.2 37.409,56 32,56 C26.59,56 21.593,54.2 17.574,51.167 M32,6 C17.663,6 6,17.664 6,32 C6,46.337 17.663,58 32,58 C46.337,58 58,46.337 58,32 C58,17.664 46.337,6 32,6 M31.9989,35.6704 C27.0359,35.6704 22.9989,31.6324 22.9989,26.6694 C22.9989,21.7054 27.0359,17.6674 31.9989,17.6674 C36.9619,17.6674 40.9989,21.7054 40.9989,26.6694 C40.9989,31.6324 36.9619,35.6704 31.9989,35.6704 M31.9989,15.6674 C25.9339,15.6674 20.9989,20.6034 20.9989,26.6694 C20.9989,32.7354 25.9339,37.6704 31.9989,37.6704 C38.0639,37.6704 42.9989,32.7354 42.9989,26.6694 C42.9989,20.6034 38.0639,15.6674 31.9989,15.6674"
        />
      </svg>
    );
  }
}
