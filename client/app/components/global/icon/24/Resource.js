import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Resource extends Component {
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
        <path d="M20,7.21504954 L20,16.7580616 L12,20.9927283 L3.99999997,16.7580616 L3.99999997,7.21504954 L12,3.00704952 L20,7.21504954 Z M19,7.81895042 L12,4.13695041 L4.99999997,7.81895042 L4.99999997,16.1559384 L12,19.8612718 L19,16.1559384 L19,7.81895042 Z M12.5,20.4009 L11.5,20.4009 L11.5,11.4612 L12.5,11.4612 L12.5,20.4009 Z M19.2660832,7.04909169 L19.7339168,7.93290827 L12,12.0267282 L4.26608318,7.93290827 L4.73391676,7.04909169 L12,10.8952718 L19.2660832,7.04909169 Z" />
      </svg>
    );
  }
}
