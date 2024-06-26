import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class SocialSlack extends Component {
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
        <path
          fillRule="evenodd"
          d="M23.9688,18.3954 L22.1558,18.9994 L22.7818,20.8794 C23.0288,21.6404 22.6258,22.4694 21.8648,22.7154 C21.7078,22.7604 21.5288,22.8044 21.3718,22.7824 C20.7898,22.7604 20.2308,22.3794 20.0298,21.7974 L19.4028,19.9164 L15.6638,21.1704 L16.2908,23.0514 C16.5368,23.8124 16.1348,24.6404 15.3728,24.8864 C15.2168,24.9314 15.0378,24.9764 14.8808,24.9544 C14.2988,24.9314 13.7398,24.5504 13.5378,23.9684 L12.9108,22.0884 L11.0978,22.6934 C10.9408,22.7384 10.7618,22.7824 10.6058,22.7604 C10.0238,22.7384 9.4638,22.3574 9.2618,21.7754 C9.0158,21.0144 9.4188,20.1864 10.1798,19.9394 L11.9928,19.3354 L10.7838,15.7314 L8.9708,16.3354 C8.8148,16.3804 8.6358,16.4254 8.4788,16.4034 C7.8968,16.3804 7.3368,15.9994 7.1358,15.4174 C6.8888,14.6574 7.2928,13.8294 8.0528,13.5834 L9.8668,12.9784 L9.2398,11.0974 C8.9938,10.3364 9.3968,9.5084 10.1578,9.2624 C10.9188,9.0164 11.7468,9.4184 11.9928,10.1804 L12.6198,12.0604 L16.3578,10.8064 L15.7318,8.9264 C15.4848,8.1664 15.8878,7.3364 16.6488,7.0904 C17.4098,6.8444 18.2388,7.2484 18.4848,8.0084 L19.1118,9.8894 L20.9248,9.2854 C21.6858,9.0394 22.5138,9.4414 22.7608,10.2024 C23.0068,10.9634 22.6038,11.7914 21.8428,12.0384 L20.0298,12.6424 L21.2378,16.2464 L23.0518,15.6414 C23.8118,15.3954 24.6398,15.7984 24.8868,16.5594 C25.1328,17.3214 24.7298,18.1494 23.9688,18.3954 M28.8258,12.1504 C25.9388,2.5244 21.7748,0.2864 12.1498,3.1734 C2.5248,6.0614 0.2858,10.2244 3.1738,19.8504 C6.0608,29.4754 10.2248,31.7134 19.8498,28.8264 C29.4758,25.9384 31.7138,21.7754 28.8258,12.1504 M13.5274,14.8211 L14.7354,18.4291 L18.4714,17.1781 L17.2634,13.5701 L13.5274,14.8211 Z"
        />
      </svg>
    );
  }
}
