import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Notifications extends Component {
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
            d="M19,10 C17.897,10 17,9.103 17,8 C17,6.897 17.897,6 19,6 C20.103,6 21,6.897 21,8 C21,9.103 20.103,10 19,10 L19,10 Z M19,17 L4,17 L4,8.626 L11.5,15.196 L17.093,10.296 C17.613,10.729 18.272,11 19,11 L19,17 Z M16.439,9.54 L11.5,13.866 L4.803,8 L16,8 C16,8.565 16.166,9.089 16.439,9.54 L16.439,9.54 Z M22,8 C22,6.346 20.654,5 19,5 C17.698,5 16.599,5.839 16.185,7 L3,7 L3,18 L20,18 L20,10.815 C21.161,10.401 22,9.302 22,8 L22,8 Z"
          />
          <path
            fill={this.fill}
            d="M19,10 C17.897,10 17,9.103 17,8 C17,6.897 17.897,6 19,6 C20.103,6 21,6.897 21,8 C21,9.103 20.103,10 19,10 L19,10 Z M19,17 L4,17 L4,8.626 L11.5,15.196 L17.093,10.296 C17.613,10.729 18.272,11 19,11 L19,17 Z M16.439,9.54 L11.5,13.866 L4.803,8 L16,8 C16,8.565 16.166,9.089 16.439,9.54 L16.439,9.54 Z M22,8 C22,6.346 20.654,5 19,5 C17.698,5 16.599,5.839 16.185,7 L3,7 L3,18 L20,18 L20,10.815 C21.161,10.401 22,9.302 22,8 L22,8 Z"
          />
        </g>
      </svg>
    );
  }
}
