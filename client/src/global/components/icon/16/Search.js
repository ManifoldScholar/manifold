import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Search extends Component {
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
    return 16;
  }

  get defaultWidth() {
    return 16;
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
    return "0 0 16 16";
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
        <path d="M7.00000003,3 C4.79086102,3 3.00000001,4.79086101 3.00000001,7.00000002 C3.00000001,9.20913903 4.79086102,11 7.00000003,11 C9.20912238,11 10.999973,9.20916605 11.0000001,7.00005001 C10.9995314,4.79106172 9.20889466,3.00044165 7.00000003,3 Z M10.8715096,10.1643028 L13.9971535,13.2899467 L13.2900467,13.9970535 L10.1644164,10.8714232 C9.30247365,11.5768009 8.20065857,12.0000001 7.00000003,12.0000001 C4.23857626,12.0000001 2,9.76142379 2,7.00000002 C2,4.23857625 4.23857626,1.99999999 7.0001,2 C9.76123985,2.00055206 11.999448,4.23876021 12.0000001,6.99990005 C12.0000001,8.2005577 11.5768322,9.30236028 10.8715096,10.1643028 Z" />
      </svg>
    );
  }
}
