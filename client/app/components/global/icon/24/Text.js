import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Text extends Component {
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
        <path d="M2.46879996,17.9944 L7.13089998,5.50439997 L8.36239998,5.50439997 L13.0245,17.9944 L11.7755,17.9944 L10.544,14.7131 L4.93169997,14.7131 L3.71779997,17.9944 L2.46879996,17.9944 Z M7.74659998,7.17209998 L5.35409997,13.5891 L10.1392,13.5891 L7.74659998,7.17209998 Z M15.29,11.6321 L14.498,10.7981 C15.3072358,9.80618683 16.5456879,9.26614244 17.8232,9.34809999 C20.1632,9.34809999 21.4477,10.5444 21.4477,12.8647 L21.4477,17.9947 L20.2686,17.9947 L20.2686,16.8157 C19.4286317,17.6824702 18.273992,18.1729468 17.067,18.1757 C15.237,18.1757 14.023,17.2323 14.023,15.6191 C14.023,14.205 14.9556,13.0273 17.5069,13.0273 C18.4512592,13.0681316 19.3832725,13.2576255 20.2686,13.5888 L20.2686,12.8642 C20.2897651,12.197878 20.0167133,11.555987 19.5220081,11.1091093 C19.0273029,10.6622316 18.3610479,10.4556268 17.7003,10.5442 C16.7835274,10.5691142 15.9151425,10.9610637 15.29,11.6321 L15.29,11.6321 Z M20.2509,15.4026 L20.2509,14.677 C19.3670633,14.3676929 18.4423819,14.1906485 17.5068,14.1516 C15.6068,14.1516 15.2368,14.967 15.2368,15.6194 C15.2368,16.3811 15.8173,16.9973 17.1015,16.9973 C18.3445501,16.9941366 19.5127112,16.4026565 20.251,15.4026 L20.2509,15.4026 Z" />
      </svg>
    );
  }
}
