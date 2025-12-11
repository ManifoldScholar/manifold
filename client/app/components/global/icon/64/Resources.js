import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Resources extends Component {
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
        <path d="M46.4401221,48.475166 L46.4438759,30.9019897 L31.8300489,22.5726135 L17.6868779,30.8968532 L17.6831241,48.4709596 L32.2978907,56.7994027 L46.4401221,48.475166 Z M15.6828758,49.6330405 L15.6871221,29.7531468 L31.8139511,20.2613865 L48.4441242,29.7400103 L48.4398779,49.6188341 L32.3141093,59.1105974 L15.6828758,49.6330405 Z M32.8978964,13.4012919 L30.8979036,13.3959081 L30.9208036,4.88890807 L32.9207964,4.89429185 L32.8978964,13.4012919 Z M23.7072718,15.5365888 L21.9525282,16.4962112 L17.9122282,9.10821116 L19.6669717,8.14858876 L23.7072718,15.5365888 Z M16.8338254,21.9810038 L15.7375746,23.6537961 L8.90007455,19.1728961 L9.99632538,17.5001038 L16.8338254,21.9810038 Z M53.9400425,16.6543533 L55.0999576,18.2836467 L48.4408576,23.0243467 L47.2809424,21.3950533 L53.9400425,16.6543533 Z M43.9166714,7.68189275 L45.7071286,8.57310717 L41.9550286,16.1111072 L40.1645714,15.2198928 L43.9166714,7.68189275 Z M31.3094,39.2288971 L33.3094,39.2293029 L33.3056,57.955603 L31.3056,57.9551971 L31.3094,39.2288971 Z M16.1919268,31.1938943 L17.1822732,29.4563057 L32.8045732,38.3603057 L31.8142268,40.0978943 L16.1919268,31.1938943 Z M46.8835408,29.4593065 L47.8980593,31.1828935 L32.7635593,40.0911935 L31.7490407,38.3676065 L46.8835408,29.4593065 Z" />
      </svg>
    );
  }
}
