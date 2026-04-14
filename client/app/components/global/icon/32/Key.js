import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Key extends Component {
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
        <path d="M7.89239997,19.4438 C5.25098769,19.4438 3.10969996,17.3025123 3.10969996,14.6611 C3.10969996,12.0196877 5.25098769,9.87839998 7.89239997,9.87839998 C10.5338123,9.87839998 12.6751,12.0196877 12.6751,14.6611 C12.6751,17.3025123 10.5338123,19.4438 7.89239997,19.4438 Z M7.89239997,18.4438 C9.9815275,18.4438 11.6751,16.7502275 11.6751,14.6611 C11.6751,12.5719725 9.9815275,10.8784 7.89239997,10.8784 C5.80327244,10.8784 4.10969996,12.5719725 4.10969996,14.6611 C4.10969996,16.7502275 5.80327244,18.4438 7.89239997,18.4438 Z M12.1751,15.1611 L12.1751,14.1611 L28.8902,14.1611 L28.8902,15.1611 L12.1751,15.1611 Z M25.0494,14.6611 L26.0494,14.6611 L26.0494,22.1216 L25.0494,22.1216 L25.0494,14.6611 Z M20.718,14.6611 L21.718,14.6611 L21.718,22.1216 L20.718,22.1216 L20.718,14.6611 Z" />
      </svg>
    );
  }
}
