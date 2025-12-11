import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Following extends Component {
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
        <path d="M35.7947,28.129 C32.1692268,28.129 29.2302,25.1899733 29.2302,21.5645 C29.2302,17.9390268 32.1692268,15 35.7947,15 C39.4201733,15 42.3592001,17.9390268 42.3592001,21.5645 C42.3592001,25.1899733 39.4201733,28.129 35.7947,28.129 Z M35.7947,26.129 C38.3156038,26.129 40.3592001,24.0854038 40.3592001,21.5645 C40.3592001,19.0435963 38.3156038,17 35.7947,17 C33.2737963,17 31.2302,19.0435963 31.2302,21.5645 C31.2302,24.0854038 33.2737963,26.129 35.7947,26.129 Z M19.2012,28.129 C15.5757268,28.129 12.6367,25.1899733 12.6367,21.5645 C12.6367,17.9390268 15.5757268,15 19.2012,15 C22.8266733,15 25.7657,17.9390268 25.7657,21.5645 C25.7657,25.1899733 22.8266733,28.129 19.2012,28.129 Z M19.2012,26.129 C21.7221038,26.129 23.7657,24.0854038 23.7657,21.5645 C23.7657,19.0435963 21.7221038,17 19.2012,17 C16.6802963,17 14.6367,19.0435963 14.6367,21.5645 C14.6367,24.0854038 16.6802963,26.129 19.2012,26.129 Z M25.1541898,23.027353 L24.3772102,21.184447 L25.595463,20.6708248 C26.8119552,20.1580268 28.1839449,20.1580268 29.4004256,20.6708199 L30.6186256,21.1843199 L29.8417745,23.0272801 L28.623563,22.5137753 C27.9038212,22.2103766 27.0920788,22.2103766 26.3723898,22.513753 L25.1541898,23.027353 Z M5,53.4950001 L5,51.4950001 L59.9434001,51.4950001 L59.9434001,53.4950001 L5,53.4950001 Z M9.82170001,44.9753 L9.82170001,52.4953001 L7.82170001,52.4953001 L7.82170001,42.9753 L51.1737001,42.9753 L51.1737001,52.4953001 L49.1737001,52.4953001 L49.1737001,44.9753 L9.82170001,44.9753 Z M12.5303,43.9757 L14.5303,43.9757 L14.5303,52.4950001 L12.5303,52.4950001 L12.5303,43.9757 Z M44.4657001,43.9757 L46.4657001,43.9757 L46.4657001,52.4950001 L44.4657001,52.4950001 L44.4657001,43.9757 Z M15.1915,35.3213 L58.5438001,35.3213 L58.5438001,44.9757 L15.1915,44.9757 L15.1915,35.3213 Z M56.5438001,42.9757 L56.5438001,37.3213 L17.1915,37.3213 L17.1915,42.9757 L56.5438001,42.9757 Z M9.28520001,26.8021 L52.6375001,26.8021 L52.6375001,37.3214 L9.28520001,37.3214 L9.28520001,26.8021 Z M11.2852,35.3214 L50.6375001,35.3214 L50.6375001,28.8021 L11.2852,28.8021 L11.2852,35.3214 Z M14.6228,27.802 L16.6228,27.802 L16.6228,36.3214 L14.6228,36.3214 L14.6228,27.802 Z M18.9649,27.802 L20.9649,27.802 L20.9649,36.3214 L18.9649,36.3214 L18.9649,27.802 Z M40.9578001,27.802 L42.9578001,27.802 L42.9578001,36.3214 L40.9578001,36.3214 L40.9578001,27.802 Z M45.2999001,27.802 L47.2999001,27.802 L47.2999001,36.3214 L45.2999001,36.3214 L45.2999001,27.802 Z" />
      </svg>
    );
  }
}
