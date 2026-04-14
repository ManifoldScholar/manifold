import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class ZoomIn extends Component {
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
      viewBox: this.viewBox
    };

    const svgProps = Object.assign(baseSvgProps, this.props.svgProps);

    return (
      <svg {...svgProps}>
        <g fill="none" fillRule="evenodd">
          <path
            fill={this.fill}
            fillRule="nonzero"
            d="M7.00000001,3 C4.79086102,3 3.00000001,4.79086101 3.00000001,7 C3.00000001,9.20913903 4.79086102,11 7.00000001,11 C9.20912238,11 11,9.20916605 11,7.00005001 C10.9995314,4.79106172 9.20889466,3.00044165 7.00000001,3 Z M10.8715096,10.1643028 L13.9971535,13.2899467 L13.2900467,13.9970535 L10.1644164,10.8714232 C9.30247363,11.5768008 8.20065856,12 7,12 C4.23857626,12 2,9.76142379 2,7 C2,4.23857625 4.23857626,2 7.0001,2 C9.76123985,2.00055206 11.999448,4.23876021 12,6.99990005 C12,8.20055769 11.5768321,9.30236027 10.8715096,10.1643028 Z M4.5,7.5 L4.500132,6.5 L9.500132,6.5 L9.5,7.5 L4.5,7.5 Z M7.5,9.5 L6.5,9.500132 L6.5,4.500132 L7.5,4.5 L7.5,9.5 Z"
          />
        </g>
      </svg>
    );
  }
}
