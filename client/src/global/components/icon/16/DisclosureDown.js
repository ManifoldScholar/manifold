import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class DisclosureDown extends Component {
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
    return 16;
  }

  get defaultWidth() {
    return 16;
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
    return "0 0 16 16";
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
        <polygon points="8 9.702 13.356 5 13.999 5.733 8 10.999 2 5.733 2.643 5" />
      </svg>
    );
  }
}
