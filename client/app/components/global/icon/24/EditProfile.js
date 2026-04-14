import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class EditProfile extends Component {
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
    return 24;
  }

  get defaultWidth() {
    return 24;
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
    return "0 0 24 24";
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
          d="M9.3785,4 C10.7565,4 11.8785,5.121 11.8785,6.5 C11.8785,7.879 10.7565,9 9.3785,9 C8.0005,9 6.8785,7.879 6.8785,6.5 C6.8785,5.121 8.0005,4 9.3785,4 M9.3785,10 C11.3085,10 12.8785,8.43 12.8785,6.5 C12.8785,4.57 11.3085,3 9.3785,3 C7.4485,3 5.8785,4.57 5.8785,6.5 C5.8785,8.43 7.4485,10 9.3785,10 M11.542,18.4863 L12.921,19.8693 L10.97,20.4403 L11.542,18.4863 Z M19.939,13.3503 L13.871,19.4053 L12.007,17.5363 L18.075,11.4823 L19.939,13.3503 Z M18.077,10.0683 L14.391,13.7453 C14.146,12.4353 13.047,11.4903 11.745,11.4903 L7.012,11.4903 C5.686,11.4903 4.565,12.4663 4.349,13.8133 L4,15.9753 L5.013,15.9753 L5.336,13.9713 C5.474,13.1133 6.179,12.4903 7.012,12.4903 L11.745,12.4903 C12.577,12.4903 13.282,13.1133 13.42,13.9713 L13.523,14.6103 L10.855,17.2713 L9.498,21.9133 L14.133,20.5563 L21.353,13.3523 L18.077,10.0683 Z"
        />
      </svg>
    );
  }
}
