import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class InteractAnnotate extends Component {
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
        <path d="M15.27625,4.18244a1.99924,1.99924,0,0,1,2.82841.00391h0l1.7207,1.7237a2.00016,2.00016,0,0,1-.00267,2.82817h0L9.60267,18.937,3.5903,20.40046l1.46561-6.0199ZM5.7823,15.6183,4.95,19.04l3.4163-.8327Zm8.234-8.767-7.802,7.783,3.134,3.141,7.801-7.784ZM13.80551,9.476l.70618.708-4.967,4.954-.70618-.708Zm3.59083-4.58373a.99924.99924,0,0,0-1.41367-.002h0L14.7243,6.1443l3.133,3.141,1.259-1.25485a1.00073,1.00073,0,0,0,.1536-1.21819l-.06918-.1015-.083-.09421Z" />
      </svg>
    );
  }
}
