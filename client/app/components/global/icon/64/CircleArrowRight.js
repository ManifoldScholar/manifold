import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class CircleArrowRight extends Component {
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
          d="M32,58 C17.6405965,58 5.99999996,46.3594035 5.99999996,32 C5.99999996,17.6405965 17.6405965,5.99999996 32,5.99999996 C46.3594035,5.99999996 58,17.6405965 58,32 C58,46.3594035 46.3594035,58 32,58 Z M32,56 C45.254834,56 56,45.254834 56,32 C56,18.745166 45.254834,7.99999996 32,7.99999996 C18.745166,7.99999996 7.99999996,18.745166 7.99999996,32 C7.99999996,45.254834 18.745166,56 32,56 Z M19.6388077,32.9918997 L19.6403922,30.9919003 L44.0007923,31.0112003 L43.9992077,33.0111997 L19.6388077,32.9918997 Z M21.019947,32 L35.2169617,44.5045804 L33.8950383,46.0054197 L17.994053,32 L33.8950383,17.9945803 L35.2169617,19.4954196 L21.019947,32 Z"
          transform="matrix(-1 0 0 1 64 0)"
        />
      </svg>
    );
  }
}
