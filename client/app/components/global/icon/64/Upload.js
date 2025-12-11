import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Upload extends Component {
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
      viewBox: this.viewBox
    };

    const svgProps = Object.assign(baseSvgProps, this.props.svgProps);

    return (
      <svg {...svgProps}>
        <g fill="none" fillRule="evenodd">
          <path
            fill={this.fill}
            fillRule="nonzero"
            d="M32.9988,29.9144136 L32.9988,42.0002 L30.9988,42.0002 L30.9988,29.9144136 L25.7059068,35.2073068 L24.2916932,33.7930932 L31.9988,26.0859864 L39.7059068,33.7930932 L38.2916932,35.2073068 L32.9988,29.9144136 Z M50.1861877,22.5986557 C56.4497399,23.0677704 61.5405685,28.1667806 61.9686336,34.4041458 C62.4434658,41.2940362 57.365095,47.2462232 50.5614005,47.9604353 L50.4578781,47.9658996 L11.6699429,47.9977815 C8.53033255,47.7930939 5.62013166,45.6673177 3.63424187,42.4514574 C-0.606099659,35.5873073 3.82653587,26.5383733 11.8099093,26.1212576 C14.0599364,26.0038929 16.2272667,26.566062 18.0852466,27.6896237 C18.5412167,20.3542541 24.6631146,14.5469 32.145,14.5469 C37.9174389,14.5469 43.0124004,18.037155 45.1604639,23.2141812 C46.7581064,22.6838525 48.4567018,22.4699946 50.1861877,22.5986557 Z M44.9652102,25.4242014 C44.4268603,25.6530481 43.8078886,25.3729597 43.6244437,24.8174965 C42.0077096,19.9220973 37.4048058,16.5469 32.145,16.5469 C25.4688521,16.5469 20.058,21.9306221 20.058,28.5689 C20.058,28.8683971 20.0747493,29.1712969 20.1115458,29.6128545 C20.1868189,30.5161318 19.1178416,31.0455547 18.4449777,30.438241 C16.6714657,28.837504 14.3554563,27.9911971 11.9141769,28.1185379 C5.4789839,28.4547641 1.87879742,35.8043081 5.33584257,41.4004793 C7.00940449,44.1105699 9.38308844,45.8444436 11.7341219,45.9999004 L50.403086,45.965947 C56.1172051,45.3394064 60.3725258,40.33352 59.9733467,34.5413681 C59.6134776,29.2976912 55.3109878,24.9882098 50.0375627,24.5931257 C48.2705385,24.4617114 46.5473971,24.7516308 44.9652102,25.4242014 Z"
          />
        </g>
      </svg>
    );
  }
}
