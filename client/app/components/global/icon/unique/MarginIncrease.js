import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class MarginIncrease extends Component {
  static propTypes = {
    className: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stroke: PropTypes.string,
    fill: PropTypes.string,
    svgProps: PropTypes.object
  };

  static defaultProps = {
    className: "appearance-menu__menu-icon",
    size: "inherit",
    stroke: "currentColor",
    fill: "currentColor",
    svgProps: {}
  };

  get defaultHeight() {
    return 50;
  }

  get defaultWidth() {
    return 96;
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
    return "0 0 96 50";
  }

  get classes() {
    const { className } = this.props;
    return classnames("manicon-svg", "icon-two-color", className);
  }

  get fill() {
    return this.props.fill;
  }

  get stroke() {
    return this.props.stroke;
  }

  get innerFillClassDark() {
    return "appearance-menu__menu-icon--dark";
  }

  get innerFillClassLight() {
    return "appearance-menu__menu-icon--light";
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
        <g>
          <path
            className={this.innerFillClassDark}
            d="M24.2967426,24 L19.3492086,19.7592566 L20.6507914,18.2407434 L28.5365907,25 L20.6507914,31.7592566 L19.3492086,30.2407434 L24.2967426,26 L12,26 L12,24 L24.2967426,24 Z M71.7032574,24 L84,24 L84,26 L71.7032574,26 L76.6507914,30.2407434 L75.3492086,31.7592566 L67.4634093,25 L75.3492086,18.2407434 L76.6507914,19.7592566 L71.7032574,24 Z"
          />
          <path
            className={this.innerFillClassLight}
            d="M57,12 L57,14 L39,14 L39,12 L57,12 Z M57,18 L57,20 L39,20 L39,18 L57,18 Z M57,24 L57,26 L39,26 L39,24 L57,24 Z M57,30 L57,32 L39,32 L39,30 L57,30 Z M57,36 L57,38 L39,38 L39,36 L57,36 Z"
          />
        </g>
      </svg>
    );
  }
}
