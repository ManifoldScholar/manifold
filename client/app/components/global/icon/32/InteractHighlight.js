import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class InteractHighlight extends Component {
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
        <path d="M11.4783643,4.69934383 L12.3422357,5.20305617 L10.4136539,8.50934383 L24.6806539,16.3813438 L26.6213643,13.0543438 L27.4852357,13.5580562 L24.3329902,18.9639173 C23.8245656,19.8845485 22.9325158,20.5237516 21.9058996,20.7134911 L21.6988559,20.7453964 L17.596098,21.2543663 C16.9677699,21.3326251 16.16773,21.8492685 15.7935143,22.4003272 L15.7149878,22.5279217 L15.155538,23.542244 L13.6856539,26.2353438 L26.4766007,26.1518109 L26.4831993,27.1517891 L13.1006539,27.2393438 L5.51465394,27.3006227 L8.85365394,21.2083438 L8.85094064,21.2073196 L9.89460647,19.3164886 C10.1963294,18.7701254 10.2502537,17.8362169 10.0343446,17.2088004 L9.9687537,17.0458073 L8.21060803,13.3034969 C7.7663503,12.3561826 7.77033985,11.2636158 8.21771372,10.316065 L8.32036428,10.1153438 L11.4783643,4.69934383 Z M9.72865394,21.6913438 L7.20920294,26.2863014 L12.5422029,26.2433014 L13.7996539,23.9393438 L9.72865394,21.6913438 Z M9.90965394,9.37334383 L9.19008884,10.6087387 C8.83569613,11.2510755 8.78300324,12.0140262 9.03851496,12.6950441 L9.1158463,12.8785927 L10.8740723,16.6210744 C11.2709159,17.4681188 11.2580119,18.7395308 10.8609908,19.6179083 L10.7700449,19.7998183 L10.2076539,20.8123438 L10.2100647,20.8141097 L10.2096539,20.8143438 L14.2782029,23.0613014 L14.8393552,22.0449441 C15.292268,21.2227848 16.3362881,20.4840169 17.2845681,20.2928072 L17.4727441,20.2620036 L21.5759229,19.7529815 C22.310058,19.6621765 22.9620766,19.2525197 23.3672963,18.630273 L23.4633643,18.4703438 L24.1766539,17.2453438 L9.90965394,9.37334383 Z" />
      </svg>
    );
  }
}
