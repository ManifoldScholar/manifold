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
    return 16;
  }

  get defaultWidth() {
    return 16;
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
    return "0 0 16 16";
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
          d="M8,2c3.3,0,6,2.7,6,6s-2.7,6-6,6c-3.3,0-6-2.7-6-6S4.7,2,8,2z M9.5,11H6.4
	c-0.5,0-0.9,0.4-0.9,0.9l0,0l-0.1,0.3C6.2,12.7,7.1,13,8,13c0.9,0,1.8-0.3,2.5-0.7l0,0l-0.1-0.4C10.4,11.4,10,11,9.5,11L9.5,11z
	 M8,3C5.2,3,3,5.2,3,8c0,1.4,0.6,2.7,1.6,3.6c0.2-0.9,1-1.6,1.9-1.6l0,0h3.1c0.9,0,1.7,0.7,1.9,1.6c1-0.9,1.6-2.2,1.6-3.6
	C13,5.2,10.8,3,8,3z M8,4c1.4,0,2.5,1.1,2.5,2.5S9.4,9,8,9S5.5,7.9,5.5,6.5S6.6,4,8,4z M8,5C7.2,5,6.5,5.7,6.5,6.5S7.2,8,8,8
	s1.5-0.7,1.5-1.5S8.8,5,8,5z"
        />
      </svg>
    );
  }
}
