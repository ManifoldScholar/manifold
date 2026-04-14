import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class SocialLinkedIn extends Component {
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
        <path d="M3.99679996,11.7357 L9.06399998,11.7357 L9.06399998,28.0205 L3.99679996,28.0205 L3.99679996,11.7357 Z M6.53139997,3.63999996 C5.34437813,3.63995963 4.2742401,4.3550427 3.82008002,5.45174661 C3.36591994,6.54845052 3.61719698,7.81074963 4.45671981,8.64992915 C5.29624264,9.48910866 6.55864443,9.73986937 7.65516249,9.28526075 C8.75168054,8.83065212 9.46632584,7.76022169 9.46579998,6.57319997 C9.46564087,5.79510783 9.15639236,5.04894752 8.60608561,4.49886581 C8.05577885,3.9487841 7.30949212,3.63984082 6.53139997,3.63999996 Z M21.9477,11.33 C19.9885418,11.2570157 18.148073,12.2676711 17.1583,13.96 L17.09,13.96 L17.09,11.7357 L12.2373,11.7357 L12.2373,28.0205 L17.2934,28.0205 L17.2934,19.9633 C17.2934,17.8397 17.6952,15.7833 20.3297,15.7833 C22.9235,15.7833 22.9604,18.2113 22.9604,20.1016 L22.9604,28.02 L28.0166,28.02 L28.0166,19.0893 C28.0166,14.7026 27.0706,11.33 21.9477,11.33 Z" />
      </svg>
    );
  }
}
