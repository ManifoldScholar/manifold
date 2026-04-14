import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class LanguageGlobe extends Component {
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
      viewBox: this.viewBox
    };

    const svgProps = Object.assign(baseSvgProps, this.props.svgProps);

    return (
      <svg {...svgProps}>
        <path d="M18.375,18.3701a8.9607,8.9607,0,0,1-3.46,2.146,7.78521,7.78521,0,0,0,1.073-1.562,12.998,12.998,0,0,0,1.175-3.454h3.148a8.99514,8.99514,0,0,1-1.936,2.87Zm-14.649-2.87H6.855a10.746,10.746,0,0,0,2.231,5,9.04137,9.04137,0,0,1-5.36-5Zm-.353-6H6.709a18.11558,18.11558,0,0,0-.192,2.495,18.52886,18.52886,0,0,0,.171,2.505H3.377a8.90788,8.90788,0,0,1-.004-5Zm2.286-3.87a8.94522,8.94522,0,0,1,3.459-2.146,7.79781,7.79781,0,0,0-1.073,1.562,12.94981,12.94981,0,0,0-1.174,3.454H3.722a8.97093,8.97093,0,0,1,1.937-2.87Zm6.858,8.87v-5h3.814a16.91542,16.91542,0,0,1,.186,2.505,16.98086,16.98086,0,0,1-.204,2.495Zm0,6.434v-5.434h3.637a11.76605,11.76605,0,0,1-1.05,2.987,4.35744,4.35744,0,0,1-2.587,2.447Zm-1-5.434v5.439c-1.615-.372-3.001-2.534-3.633-5.439Zm0-12.435v5.435H7.88a11.714,11.714,0,0,1,1.05-2.987,4.363,4.363,0,0,1,2.587-2.448Zm1-.005c1.615.372,3.001,2.535,3.633,5.44H12.517Zm-5,8.935a17.132,17.132,0,0,1,.203-2.495h3.797v5H7.703a16.76129,16.76129,0,0,1-.186-2.505Zm13.5.014a9.04527,9.04527,0,0,1-.356,2.491H17.324a18.12491,18.12491,0,0,0,.193-2.495,18.36328,18.36328,0,0,0-.172-2.505h3.311a8.96718,8.96718,0,0,1,.361,2.509Zm-.709-3.509h-3.13a10.73128,10.73128,0,0,0-2.231-5,9.04038,9.04038,0,0,1,5.361,5Zm-1.214-3.565a9.936,9.936,0,0,0-7.068-2.935h-.01a10,10,0,0,0-.008,20h.01a9.9999,9.9999,0,0,0,7.076-17.065Z" />
      </svg>
    );
  }
}
