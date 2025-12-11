import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class InteractComment extends Component {
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
        <path d="M23.333,6 C25.0823144,6 26.5,7.41744733 26.5,9.16693343 L26.5,9.16693343 L26.5,17.8369679 C26.5,19.5865869 25.0821816,21.0049017 23.333,21.0049017 L23.333,21.0049017 L18.858,21.004 L11.5,27.6221427 L11.5,21.004 L8.666,21.0049017 C6.97726319,21.0049017 5.59811565,19.6828392 5.50501004,18.0167494 L5.50501004,18.0167494 L5.5,17.8369679 L5.5,9.16693343 C5.5,7.4173145 6.91681844,6 8.666,6 L8.666,6 Z M23.333,7 L8.666,7 C7.46918156,7 6.5,7.9695209 6.5,9.16693343 L6.5,9.16693343 L6.5,17.8369679 C6.5,19.0346293 7.46943035,20.0049017 8.666,20.0049017 L8.666,20.0049017 L12.5,20.0049017 L12.5,25.377 L18.4742343,20.0049017 L23.333,20.0049017 C24.5298184,20.0049017 25.5,19.0343805 25.5,17.8369679 L25.5,17.8369679 L25.5,9.16693343 C25.5,7.96976971 24.5300673,7 23.333,7 L23.333,7 Z M21.5568115,15 L21.5568115,16 L10.5,16 L10.5,15 L21.5568115,15 Z M21.5568115,11 L21.5568115,12 L10.5,12 L10.5,11 L21.5568115,11 Z" />
      </svg>
    );
  }
}
