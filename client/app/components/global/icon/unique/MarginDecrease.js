import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class MarginDecrease extends Component {
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
    return classnames("manicon-svg", className);
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
            d="M14.2398482,24 L25.5365907,24 L25.5365907,26 L14.2398482,26 L19.1873821,30.2407434 L17.8857994,31.7592566 L10,25 L17.8857994,18.2407434 L19.1873821,19.7592566 L14.2398482,24 Z M80.8333333,26 L69.5365907,26 L69.5365907,24 L80.8333333,24 L75.8857994,19.7592566 L77.1873821,18.2407434 L85.0731815,25 L77.1873821,31.7592566 L75.8857994,30.2407434 L80.8333333,26 Z"
          />
          <path
            className={this.innerFillClassLight}
            d="M63.5365907,12 L63.5365907,14 L31.5365907,14 L31.5365907,12 L63.5365907,12 Z M63.5365907,18 L63.5365907,20 L31.5365907,20 L31.5365907,18 L63.5365907,18 Z M63.5365907,24 L63.5365907,26 L31.5365907,26 L31.5365907,24 L63.5365907,24 Z M63.5365907,30 L63.5365907,32 L31.5365907,32 L31.5365907,30 L63.5365907,30 Z M63.5365907,36 L63.5365907,38 L31.5365907,38 L31.5365907,36 L63.5365907,36 Z"
          />
        </g>
      </svg>
    );
  }
}
