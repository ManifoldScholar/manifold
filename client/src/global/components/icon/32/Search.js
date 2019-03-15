import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Search extends Component {
  static propTypes = {
    iconClass: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stroke: PropTypes.string,
    fill: PropTypes.string,
    svgProps: PropTypes.object
  };

  static defaultProps = {
    iconClass: "",
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
    const { iconClass } = this.props;
    return classnames("manicon-svg", iconClass);
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
      viewBox: this.viewBox
    };

    const svgProps = Object.assign(baseSvgProps, this.props.svgProps);

    return (
      <svg {...svgProps}>
        <g fill="none" fillRule="evenodd">
          <path
            fill={this.fill}
            fillRule="nonzero"
            d="M14.5788,8.78999998 C11.4031627,8.78999998 8.82879998,11.3643627 8.82879998,14.54 C8.82879998,17.7156373 11.4031627,20.29 14.5788,20.29 C17.7544173,20.29 20.3287676,17.7156697 20.3288,14.54006 C20.3280058,11.3646996 17.754048,8.79076178 14.5788,8.78999998 Z M21.3288,14.53988 C21.3288,18.2679221 18.3067221,21.29 14.5788,21.29 C10.8508779,21.29 7.82879998,18.2679221 7.82879998,14.54 C7.82879998,10.8120779 10.8508779,7.78999998 14.57892,7.78999999 C18.3064053,7.79089426 21.3279057,10.8123947 21.3288,14.53988 Z M18.6226191,19.2907997 L19.3357809,18.5898003 L24.1714809,23.5094003 L23.4583191,24.2103997 L18.6226191,19.2907997 Z"
          />
          <path
            fill={this.fill}
            fillRule="nonzero"
            d="M14.5788,8.78999998 C11.4031627,8.78999998 8.82879998,11.3643627 8.82879998,14.54 C8.82879998,17.7156373 11.4031627,20.29 14.5788,20.29 C17.7544173,20.29 20.3287676,17.7156697 20.3288,14.54006 C20.3280058,11.3646996 17.754048,8.79076178 14.5788,8.78999998 Z M21.3288,14.53988 C21.3288,18.2679221 18.3067221,21.29 14.5788,21.29 C10.8508779,21.29 7.82879998,18.2679221 7.82879998,14.54 C7.82879998,10.8120779 10.8508779,7.78999998 14.57892,7.78999999 C18.3064053,7.79089426 21.3279057,10.8123947 21.3288,14.53988 Z M18.6226191,19.2907997 L19.3357809,18.5898003 L24.1714809,23.5094003 L23.4583191,24.2103997 L18.6226191,19.2907997 Z"
          />
        </g>
      </svg>
    );
  }
}
