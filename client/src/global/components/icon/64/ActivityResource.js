import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class ActivityResource extends Component {
  static propTypes = {
    iconClass: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stroke: PropTypes.string,
    fill: PropTypes.string,
    svgProps: PropTypes.object
  };

  static defaultProps = {
    iconClass: "",
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
    const { iconClass } = this.props;
    return classnames("manicon-svg", iconClass);
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
            d="M63,32 C63,49.12 49.121,63 32,63 C14.879,63 1,49.12 1,32 C1,14.879 14.879,1 32,1 C49.121,1 63,14.879 63,32 M33.0185,11.0078 L31.0185,11.0018 L30.9995,18.0018 L32.9995,18.0078 L33.0185,11.0078 Z M25.538,19.2139 L22.303,13.2039 L20.541,14.1519 L23.776,20.1609 L25.538,19.2139 Z M19.9697,24.3877 L14.4927,20.7427 L13.3857,22.4077 L18.8627,26.0517 L19.9697,24.3877 Z M50.6259,21.6797 L49.4539,20.0587 L44.1199,23.9147 L45.2919,25.5357 L50.6259,21.6797 Z M43.1621,13.7109 L41.3651,12.8299 L38.3601,18.9619 L40.1571,19.8429 L43.1621,13.7109 Z M32.9892,51.3311 L32.9892,38.6031 L44.0002,32.6991 L44.0002,45.4011 L32.9892,51.3311 Z M20.0002,32.7001 L30.9892,38.6021 L30.9892,51.3301 L20.0002,45.4021 L20.0002,32.7001 Z M42.8542,31.0441 L31.9892,36.8701 L21.1422,31.0441 L31.9892,25.1441 L42.8542,31.0441 Z M18.0002,30.4771 L18.0002,46.5961 L31.9892,54.1411 L46.0002,46.5971 L46.0002,30.4771 L31.9892,22.8661 L18.0002,30.4771 Z"
          />
          <path
            fill={this.fill}
            d="M63,32 C63,49.12 49.121,63 32,63 C14.879,63 1,49.12 1,32 C1,14.879 14.879,1 32,1 C49.121,1 63,14.879 63,32 M33.0185,11.0078 L31.0185,11.0018 L30.9995,18.0018 L32.9995,18.0078 L33.0185,11.0078 Z M25.538,19.2139 L22.303,13.2039 L20.541,14.1519 L23.776,20.1609 L25.538,19.2139 Z M19.9697,24.3877 L14.4927,20.7427 L13.3857,22.4077 L18.8627,26.0517 L19.9697,24.3877 Z M50.6259,21.6797 L49.4539,20.0587 L44.1199,23.9147 L45.2919,25.5357 L50.6259,21.6797 Z M43.1621,13.7109 L41.3651,12.8299 L38.3601,18.9619 L40.1571,19.8429 L43.1621,13.7109 Z M32.9892,51.3311 L32.9892,38.6031 L44.0002,32.6991 L44.0002,45.4011 L32.9892,51.3311 Z M20.0002,32.7001 L30.9892,38.6021 L30.9892,51.3301 L20.0002,45.4021 L20.0002,32.7001 Z M42.8542,31.0441 L31.9892,36.8701 L21.1422,31.0441 L31.9892,25.1441 L42.8542,31.0441 Z M18.0002,30.4771 L18.0002,46.5961 L31.9892,54.1411 L46.0002,46.5971 L46.0002,30.4771 L31.9892,22.8661 L18.0002,30.4771 Z"
          />
        </g>
      </svg>
    );
  }
}
