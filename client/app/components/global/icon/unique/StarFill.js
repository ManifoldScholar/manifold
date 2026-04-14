import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class StarFill extends Component {
  static displayName = "Icon.StarFill";

  static propTypes = {
    className: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
    return 28;
  }

  get defaultWidth() {
    return 28;
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
    return "0 0 28 28";
  }

  get classes() {
    const { className } = this.props;
    return classnames("manicon-svg", "icon-star-fill", className);
  }

  get fill() {
    return this.props.fill;
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
          className="icon-star-fill__background"
          d="M10.25554,0h7.48892c3.56607,0,4.85922.3713,6.16292,1.06853a7.26913,7.26913,0,0,1,3.02409,3.02409C27.6287,5.39632,28,6.68947,28,10.25554v7.48892c0,3.56607-.3713,4.85922-1.06853,6.16292a7.26913,7.26913,0,0,1-3.02409,3.02409C22.60368,27.6287,21.31053,28,17.74446,28H10.25554c-3.56607,0-4.85922-.3713-6.16292-1.06853a7.26913,7.26913,0,0,1-3.02409-3.02409C.3713,22.60368,0,21.31053,0,17.74446V10.25554C0,6.68947.3713,5.39632,1.06853,4.09262A7.26913,7.26913,0,0,1,4.09262,1.06853C5.39632.3713,6.68947,0,10.25554,0Z"
        />
        <polygon
          className="icon-star-fill__foreground"
          points="19.254 21.5 14.001 18.22 8.746 21.5 10.225 15.506 5.5 11.612 11.667 11.115 14.001 5.5 16.333 11.115 22.5 11.612 17.775 15.506 19.254 21.5"
        />
      </svg>
    );
  }
}
