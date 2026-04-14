import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class ActivityResource extends Component {
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
        <path
          fillRule="evenodd"
          d="M64,32A32,32,0,1,1,32,0,32.00043,32.00043,0,0,1,64,32M33.05136,10.33063l-2.06452-.00619-.01961,7.22581,2.06451.00619Zm-7.72181,8.47081-3.33936-6.20387-1.81883.97859L23.51071,19.779Zm-5.74792,5.3407L13.928,20.37956l-1.14271,1.71871,5.65368,3.76155Zm31.64511-2.79535L50.01693,19.6735l-5.50607,3.98038,1.20981,1.67329Zm-7.70457-8.22586-1.855-.90942-3.10194,6.32981,1.855.90941ZM33.02111,51.95468V38.8161L44.3873,32.72165V45.83339Zm-13.408-19.232,11.34348,6.09239V51.95365L19.61311,45.83443Zm23.59122-1.70942L31.98885,37.0272,20.792,31.01326l11.1969-6.09032ZM17.54859,30.428v16.639l14.44026,7.78839,14.463-7.78736V30.428l-14.463-7.85651Z"
        />
      </svg>
    );
  }
}
