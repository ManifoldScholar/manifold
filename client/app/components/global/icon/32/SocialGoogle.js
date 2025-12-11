import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class SocialGoogle extends Component {
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
        <path d="M10.9091,24.9091 C5.98873996,24.9091 2.00000009,20.92036 2.00000009,16 C2.00000009,11.07964 5.98873996,7.09090005 10.9091,7.09089997 C13.1256754,7.06313513 15.2661949,7.8983505 16.8782,9.41999998 L14.46,11.7491 C13.5031919,10.8417635 12.2274452,10.3479052 10.9091,10.3745 C7.8414446,10.4293756 5.38333152,12.9318538 5.38333152,16 C5.38333152,19.0681462 7.8414446,21.5706244 10.9091,21.6255 C13.3196068,21.7949447 15.4818153,20.1501051 15.9618,17.7818 L10.9091,17.7818 L10.9091,14.7273 L19.3218,14.7273 C19.4130085,15.2141547 19.4598671,15.7082792 19.4618,16.2036 C19.4618,21.2946 16.0509,24.9091 10.9091,24.9091 Z M30,17.2727 L27.4545,17.2727 L27.4545,19.8182 L24.9091,19.8182 L24.9091,17.2727 L22.3636,17.2727 L22.3636,14.7273 L24.9091,14.7273 L24.9091,12.1818 L27.4545,12.1818 L27.4545,14.7273 L30,14.7273 L30,17.2727 Z" />
      </svg>
    );
  }
}
