import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Settings extends Component {
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
        <path d="M23.5,14.4504509 C22.6093161,14.2483654 21.9444,13.4518324 21.9444,12.5 C21.9444,11.5481675 22.6093161,10.7516345 23.5,10.5495491 L23.5,5.99999997 L24.5,5.99999997 L24.5,10.5781832 C25.3342621,10.8189409 25.9444,11.5882178 25.9444,12.5 C25.9444,13.4117822 25.3342621,14.1810591 24.5,14.4218168 L24.5,26 L23.5,26 L23.5,14.4504509 Z M7.49999997,14.4218168 C6.66573791,14.1810591 6.05559997,13.4117822 6.05559997,12.5 C6.05559997,11.5882178 6.66573791,10.8189409 7.49999997,10.5781832 L7.49999997,5.99999997 L8.49999998,5.99999997 L8.49999998,10.5495491 C9.39068395,10.7516345 10.0556,11.5481675 10.0556,12.5 C10.0556,13.4518324 9.39068395,14.2483654 8.49999998,14.4504509 L8.49999998,26 L7.49999997,26 L7.49999997,14.4218168 L7.49999997,14.4218168 Z M15.5,21.4369913 C14.6373864,21.2149699 14,20.4319197 14,19.5 C14,18.5680803 14.6373864,17.7850301 15.5,17.5630087 L15.5,5.99999997 L16.5,5.99999997 L16.5,17.5630087 C17.3626136,17.7850301 18,18.5680803 18,19.5 C18,20.4319197 17.3626136,21.2149699 16.5,21.4369913 L16.5,26 L15.5,26 L15.5,21.4369913 Z" />
      </svg>
    );
  }
}
