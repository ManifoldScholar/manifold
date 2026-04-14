import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Notifications extends Component {
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
        <path d="M21,10.0980483 L21,17.499 L3,17.499 L3,6.499 L16.6708057,6.499 C17.0826008,5.33378734 18.1936863,4.4992 19.5001,4.4992 C21.1572424,4.4992 22.5001,5.84205763 22.5001,7.4992 C22.5001,8.60991078 21.8968292,9.57943101 21,10.0980483 Z M16.5001,7.499 L4.89352556,7.499 L12.0001,13.3514731 L17.0329753,9.20675226 C16.6969712,8.72213638 16.5001,8.13370622 16.5001,7.4992 Z M17.7341318,9.9247831 L12.0001,14.6469269 L4,8.05860928 L4,16.499 L20,16.499 L20,10.4577577 C19.8374314,10.4850136 19.6704258,10.4992 19.5001,10.4992 C18.8398741,10.4992 18.2295354,10.2860451 17.7341318,9.9247831 Z M21.5001,7.4992 C21.5001,6.39434237 20.6049576,5.4992 19.5001,5.4992 C18.3952424,5.4992 17.5001,6.39434237 17.5001,7.4992 C17.5001,8.60405763 18.3952424,9.4992 19.5001,9.4992 C20.6049576,9.4992 21.5001,8.60405763 21.5001,7.4992 Z" />
      </svg>
    );
  }
}
