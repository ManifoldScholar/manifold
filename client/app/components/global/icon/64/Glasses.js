import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Glasses extends Component {
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
        <path d="M36.2864,44.6707 C31.5971375,44.6707 27.8063,40.7811906 27.8063,35.9959 C27.8063,31.2106094 31.5971375,27.3211 36.2864,27.3211 C40.9756625,27.3211 44.7665,31.2106094 44.7665,35.9959 C44.7665,40.7811906 40.9756625,44.6707 36.2864,44.6707 Z M36.2864,42.6707 C39.8594278,42.6707 42.7665,39.6879594 42.7665,35.9959 C42.7665,32.3038406 39.8594278,29.3211 36.2864,29.3211 C32.7133722,29.3211 29.8063,32.3038406 29.8063,35.9959 C29.8063,39.6879594 32.7133722,42.6707 36.2864,42.6707 Z M44.4826256,37.0717714 L43.0503744,35.6758286 L53.6194399,24.8318844 C54.7775082,23.6567489 56.5361328,23.3087494 58.0544759,23.9542722 C59.572819,24.599795 60.5424095,26.1076937 60.4996644,27.7570082 L58.5003357,27.7051918 C58.5218093,26.8766359 58.0347222,26.1191222 57.2719616,25.794835 C56.509201,25.4705477 55.6257317,25.6453701 55.0478256,26.2317714 L44.4826256,37.0717714 Z M18.1646891,29.6294382 L16.7277108,28.2383618 L24.1767711,20.5435557 C25.3345661,19.3681325 27.0931583,19.0197849 28.6116086,19.6650889 C30.130059,20.3103928 31.0998212,21.8182237 31.0571657,23.4675536 L29.0578343,23.4158463 C29.0792612,22.587344 28.5921239,21.8299204 27.8293658,21.5057671 C27.0666078,21.1816137 26.1832201,21.356598 25.6076891,21.9408382 L18.1646891,29.6294382 Z M21.8571638,37.6602477 L21.0628362,35.8247523 L22.700082,35.116219 C24.2523393,34.4441556 26.0134606,34.4441556 27.5655842,35.1161611 L29.2028842,35.8247611 L28.4085157,37.6602389 L26.771082,36.951581 C25.7258414,36.4990349 24.5399586,36.4990349 23.4945638,36.9516477 L21.8571638,37.6602477 Z M13.9801,44.6707 C9.29083744,44.6707 5.49999996,40.7811906 5.49999996,35.9959 C5.49999996,31.2106094 9.29083744,27.3211 13.9801,27.3211 C18.6693625,27.3211 22.4602,31.2106094 22.4602,35.9959 C22.4602,40.7811906 18.6693625,44.6707 13.9801,44.6707 Z M13.9801,42.6707 C17.5531278,42.6707 20.4602,39.6879594 20.4602,35.9959 C20.4602,32.3038406 17.5531278,29.3211 13.9801,29.3211 C10.4070722,29.3211 7.49999996,32.3038406 7.49999996,35.9959 C7.49999996,39.6879594 10.4070722,42.6707 13.9801,42.6707 Z" />
      </svg>
    );
  }
}
