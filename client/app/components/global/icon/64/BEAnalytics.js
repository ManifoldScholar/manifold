import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class BEAnalytics extends Component {
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
        <path d="M43.2310842,34.9036276 C43.7145916,35.5648996 44,36.3801935 44,37.2622 C44,39.4707786 42.208991,41.2622 40,41.2622 C37.791009,41.2622 36,39.4707786 36,37.2622 C36,36.6824998 36.1232906,36.131618 36.3450831,35.6343436 L27.4091883,28.5295563 C26.7390738,29.0359955 25.9045827,29.3364 25,29.3364 C24.4370149,29.3364 23.9011794,29.22004 23.4152229,29.0100699 L13.1647824,42.2172311 C13.6883776,42.8935788 14,43.7422483 14,44.6635 C14,46.8727847 12.2092847,48.6635 10,48.6635 C7.79071525,48.6635 6,46.8727847 6,44.6635 C6,42.4549214 7.79100901,40.6635 10,40.6635 C10.5629851,40.6635 11.0988206,40.77986 11.5847771,40.9898301 L21.8359837,27.7836581 C21.3119264,27.1071487 21,26.2581009 21,25.3364 C21,23.1271153 22.7907153,21.3364 25,21.3364 C27.2092847,21.3364 29,23.1271153 29,25.3364 C29,25.9159149 28.8766891,26.4667086 28.6548722,26.963954 L37.5911986,34.0684465 C38.2612098,33.5623329 39.0955277,33.2622 40,33.2622 C40.6021452,33.2622 41.1731972,33.3952227 41.6853747,33.6334869 L51.7690002,21.3586672 C51.2854552,20.6973617 51,19.8821246 51,19.0004 C51,16.7911153 52.7907153,15.0004 55,15.0004 C57.2092847,15.0004 59,16.7911153 59,19.0004 C59,21.2089786 57.208991,23.0004 55,23.0004 C54.3975479,23.0004 53.8261854,22.8671538 53.313765,22.628539 Z M10,42.6635 C8.8956816,42.6635 8,43.5593878 8,44.6635 C8,45.7682153 8.89528475,46.6635 10,46.6635 C11.1047153,46.6635 12,45.7682153 12,44.6635 C12,43.5593878 11.1043184,42.6635 10,42.6635 Z M40,35.2622 C38.8952847,35.2622 38,36.1574847 38,37.2622 C38,38.3663122 38.8956816,39.2622 40,39.2622 C41.1043184,39.2622 42,38.3663122 42,37.2622 C42,36.1574847 41.1047153,35.2622 40,35.2622 Z M25,23.3364 C23.8952847,23.3364 23,24.2316847 23,25.3364 C23,26.4405122 23.8956816,27.3364 25,27.3364 C26.1043184,27.3364 27,26.4405122 27,25.3364 C27,24.2316847 26.1047153,23.3364 25,23.3364 Z M55,17.0004 C53.8952847,17.0004 53,17.8956847 53,19.0004 C53,20.1045122 53.8956816,21.0004 55,21.0004 C56.1043184,21.0004 57,20.1045122 57,19.0004 C57,17.8956847 56.1047153,17.0004 55,17.0004 Z" />
      </svg>
    );
  }
}
