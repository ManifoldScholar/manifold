import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class ResourceImage extends Component {
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
        <path d="M5.99999996,13 L5.99999996,51 L58,51 L58,13 L5.99999996,13 Z M60,11 L60,53 L3.99999996,53 L3.99999996,11 L60,11 Z M45.114319,36.7052772 C46.0891538,35.776283 47.4070852,35.2956435 48.7511053,35.3789689 C50.0951254,35.4622943 51.3435959,36.1020435 52.2251484,37.1814515 L59.8029485,47.3896515 L58.1970516,48.5817485 L50.6481834,38.4106653 C50.1480528,37.7992777 49.4157245,37.4240133 48.6273486,37.3751363 C47.8389728,37.3262592 47.0659001,37.608193 46.5124285,38.1351833 L39.6414917,45.0279719 L38.9387682,44.1921171 L25.4012973,28.0888039 C24.8721474,27.5066301 24.1255162,27.1696052 23.3388857,27.1578435 C22.5522552,27.1460819 21.7958816,27.4606339 21.2723966,28.0022606 L5.74239658,45.2113607 L4.25760333,43.8714394 L19.8104371,26.6378727 C20.7408786,25.6737527 22.029067,25.1380356 23.3687863,25.1580671 C24.7085055,25.1780985 25.9801016,25.7520894 26.9067318,26.7726829 L39.7669351,42.06926 L45.114319,36.7052772 Z M45.0127,29.9813 C41.6989915,29.9813 39.0127,27.2950085 39.0127,23.9813 C39.0127,20.6675915 41.6989915,17.9813 45.0127,17.9813 C48.3264085,17.9813 51.0127,20.6675915 51.0127,23.9813 C51.0127,27.2950085 48.3264085,29.9813 45.0127,29.9813 Z M45.0127,27.9813 C47.221839,27.9813 49.0127,26.190439 49.0127,23.9813 C49.0127,21.772161 47.221839,19.9813 45.0127,19.9813 C42.803561,19.9813 41.0127,21.772161 41.0127,23.9813 C41.0127,26.190439 42.803561,27.9813 45.0127,27.9813 Z" />
      </svg>
    );
  }
}
