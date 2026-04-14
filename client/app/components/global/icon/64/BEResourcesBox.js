import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class BEResourcesBox extends Component {
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
        <path d="M46.3881227,48.4009376 L46.3918753,30.9062606 L31.8300827,22.6143626 L17.737908,30.9020636 L17.7350935,48.3967216 L32.2969005,56.6886279 L46.3881227,48.4009376 Z M15.7349064,49.5592784 L15.738092,29.7579364 L31.8139173,20.3036374 L48.3921247,29.7437393 L48.3878773,49.5450625 L32.3130995,58.9993722 L15.7349064,49.5592784 Z M32.8980963,13.4767032 L30.8981037,13.4712967 L30.9210037,4.99999672 L32.9209963,5.00540319 L32.8980963,13.4767032 Z M23.7377011,15.6007769 L21.9832989,16.5610231 L17.9564988,9.20392305 L19.7109011,8.24367688 L23.7377011,15.6007769 Z M16.8860026,22.0168924 L15.7903974,23.6901076 L8.97569735,19.2279076 L10.0713026,17.5546924 L16.8860026,22.0168924 Z M53.8650681,16.7125216 L55.024332,18.3422784 L48.387432,23.0631784 L47.2281681,21.4334216 L53.8650681,16.7125216 Z M43.8739203,7.77909374 L45.6640797,8.67090619 L41.9245797,16.1773062 L40.1344203,15.2854938 L43.8739203,7.77909374 Z M31.3083,39.1962962 L33.3083,39.1967038 L33.3045,57.8447038 L31.3045,57.8442963 L31.3083,39.1962962 Z M16.2434424,31.1987741 L17.2331576,29.4608259 L32.8031576,38.3275259 L31.8134424,40.0654741 L16.2434424,31.1987741 Z M46.8323598,29.4637188 L47.8462402,31.1876812 L32.7623402,40.0586812 L31.7484598,38.3347188 L46.8323598,29.4637188 Z" />
      </svg>
    );
  }
}
