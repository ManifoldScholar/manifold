import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Avatar extends Component {
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
        <path
          fillRule="evenodd"
          d="M17.06,18.19 L16.95,17.444 C16.738,16.014 15.631,14.977 14.316,14.977 L9.65,14.977 C8.336,14.977 7.228,16.014 7.017,17.444 L6.91,18.167 C5.134,16.698 4,14.479 4,12 C4,7.588 7.589,4 12,4 C16.412,4 20,7.588 20,12 C20,14.493 18.853,16.722 17.06,18.19 M7.826,18.811 L8.006,17.59 C8.144,16.656 8.836,15.977 9.65,15.977 L14.316,15.977 C15.131,15.977 15.822,16.656 15.96,17.59 L16.144,18.831 C14.934,19.567 13.518,20 12,20 C10.47,20 9.043,19.56 7.826,18.811 M12,3 C7.038,3 3,7.037 3,12 C3,16.962 7.038,21 12,21 C16.963,21 21,16.962 21,12 C21,7.037 16.963,3 12,3 M11.9999,12.4751 C10.6219,12.4751 9.4999,11.3541 9.4999,9.9751 C9.4999,8.5961 10.6219,7.4751 11.9999,7.4751 C13.3779,7.4751 14.4999,8.5961 14.4999,9.9751 C14.4999,11.3541 13.3779,12.4751 11.9999,12.4751 M11.9999,6.4751 C10.0699,6.4751 8.4999,8.0451 8.4999,9.9751 C8.4999,11.9051 10.0699,13.4751 11.9999,13.4751 C13.9299,13.4751 15.4999,11.9051 15.4999,9.9751 C15.4999,8.0451 13.9299,6.4751 11.9999,6.4751"
        />
      </svg>
    );
  }
}
