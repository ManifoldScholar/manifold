import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Lamp extends Component {
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
    return 64;
  }

  get defaultWidth() {
    return 64;
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
    return "0 0 64 64";
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
        <path d="M44.314549,33.1909886 L45.9318511,32.0144114 L49.1634511,36.4565114 L47.546149,37.6330886 L44.314549,33.1909886 Z M47.7134278,29.8115965 L48.5257723,27.9840035 L53.5454723,30.2152035 L52.7331278,32.0427965 L47.7134278,29.8115965 Z M48.9673311,25.1854584 L48.7570689,23.1965416 L54.2197689,22.6190416 L54.4300311,24.6079584 L48.9673311,25.1854584 Z M34.6515965,38.9963723 L32.8240035,38.1840278 L35.0552035,33.1643278 L36.8827965,33.9766722 L34.6515965,38.9963723 Z M42.2477586,39.6706708 L40.2588414,39.8809292 L39.6813414,34.4181292 L41.6702586,34.2078708 L42.2477586,39.6706708 Z M21.8055661,55.2600612 L20.0844339,56.2787388 L13.8494454,45.7442583 C10.1665975,39.5221317 11.8255838,31.5192434 17.6783357,27.2738322 L26.7793357,20.6722322 L27.9536643,22.2911678 L18.8526639,28.892768 C13.8357087,32.5319174 12.4136324,39.3919604 15.5705661,44.7255612 L21.8055661,55.2600612 Z M34.6171323,10.3538753 L26.4778605,16.2936667 L32.7831452,28.1653016 L43.999866,19.9791535 L34.6171323,10.3538753 Z M32.0988548,31.1406984 L23.8981395,15.7003333 L34.8388677,7.71612467 L47.042134,20.2348465 L32.0988548,31.1406984 Z M10.3684,56.7693 L10.3684,54.7693 L30.2014,54.7693 L30.2014,56.7693 L10.3684,56.7693 Z M30.9602576,11.6871433 L29.4425424,12.9896566 L26.6075424,9.6862566 L28.1252576,8.38374333 L30.9602576,11.6871433 Z" />
      </svg>
    );
  }
}
