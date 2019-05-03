import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class SocialEmail extends Component {
  static defaultProps = {
    iconClass: "",
    size: "inherit",
    stroke: "currentColor",
    fill: "currentColor",
    svgProps: {}
  };

  static propTypes = {
    iconClass: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stroke: PropTypes.string,
    fill: PropTypes.string,
    svgProps: PropTypes.object
  };

  get classes() {
    const { iconClass } = this.props;
    return classnames("manicon-svg", iconClass);
  }

  get defaultHeight() {
    return 32;
  }

  get defaultWidth() {
    return 32;
  }

  get fill() {
    return this.props.fill;
  }

  get height() {
    if (this.size === null || this.size === "inherit") return null;
    if (this.size === "default") return this.defaultHeight;
    return this.size;
  }

  get size() {
    return this.props.size;
  }

  get stroke() {
    return this.props.stroke;
  }

  get viewBox() {
    return "0 0 32 32";
  }

  get width() {
    if (this.size === null || this.size === "inherit") return null;
    if (this.size === "default") return this.defaultWidth;
    return this.size;
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
        <path d="M28.586,6.99999997 L3.41499996,6.99999997 L16,18.159 L28.586,6.99999997 L28.586,6.99999997 Z M16,20.584 L2.99999996,9.05699998 L2.99999996,25 L29,25 L29,9.05699998 L16,20.584 L16,20.584 Z" />
      </svg>
    );
  }
}
