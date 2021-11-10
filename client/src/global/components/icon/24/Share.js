import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Share extends Component {
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
        <path d="M6.49999998,15.4956 C4.56700334,15.4956 2.99999996,13.9285966 2.99999996,11.9956 C2.99999996,10.0626034 4.56700334,8.49559999 6.49999998,8.49559999 C8.43299661,8.49559999 9.99999999,10.0626034 9.99999999,11.9956 C9.99999999,13.9285966 8.43299661,15.4956 6.49999998,15.4956 Z M6.49999998,14.4956 C7.88071186,14.4956 8.99999999,13.3763119 8.99999999,11.9956 C8.99999999,10.6148881 7.88071186,9.49559999 6.49999998,9.49559999 C5.1192881,9.49559999 3.99999997,10.6148881 3.99999997,11.9956 C3.99999997,13.3763119 5.1192881,14.4956 6.49999998,14.4956 Z M17.5,9.00439999 C15.5670034,9.00439999 14,7.43739661 14,5.50439997 C14,3.57140334 15.5670034,2.00439996 17.5,2.00439996 C19.4329967,2.00439996 21,3.57140334 21,5.50439997 C21,7.43739661 19.4329967,9.00439999 17.5,9.00439999 Z M17.5,8.00439998 C18.8807119,8.00439998 20,6.88511185 20,5.50439997 C20,4.12368809 18.8807119,3.00439996 17.5,3.00439996 C16.1192881,3.00439996 15,4.12368809 15,5.50439997 C15,6.88511185 16.1192881,8.00439998 17.5,8.00439998 Z M17.5,21.9956 C15.5670034,21.9956 14,20.4285967 14,18.4956 C14,16.5626034 15.5670034,14.9956 17.5,14.9956 C19.4329967,14.9956 21,16.5626034 21,18.4956 C21,20.4285967 19.4329967,21.9956 17.5,21.9956 Z M17.5,20.9956 C18.8807119,20.9956 20,19.8763119 20,18.4956 C20,17.1148881 18.8807119,15.9956 17.5,15.9956 C16.1192881,15.9956 15,17.1148881 15,18.4956 C15,19.8763119 16.1192881,20.9956 17.5,20.9956 Z M9.30146514,10.929763 L8.79273484,10.068837 L14.6985349,6.579037 L15.2072652,7.43996295 L9.30146514,10.929763 Z M8.79273484,13.931163 L9.30146514,13.070237 L15.2072652,16.560037 L14.6985349,17.420963 L8.79273484,13.931163 Z" />
      </svg>
    );
  }
}
