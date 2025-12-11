import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class TextsBook extends Component {
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
        <path d="M47.4045,11.4461 L18.5955,11.4461 C18.065067,11.4461 17.5563592,11.6568136 17.1812864,12.0318864 C16.8062137,12.4069592 16.5955,12.915667 16.5955,13.4461 L16.5955,50.5539 C16.5955,51.084333 16.8062137,51.5930408 17.1812864,51.9681136 C17.5563592,52.3431864 18.065067,52.5539 18.5955,52.5539 L47.4045,52.5539 L47.4045,11.4461 Z M14.5955,50.5539 L14.5955,13.4461 C14.5955,12.385234 15.0169273,11.3678184 15.7670729,10.6176728 C16.5172184,9.86752733 17.534634,9.44609997 18.5955,9.44609997 L49.4045,9.44609997 L49.4045,54.5539 L18.5955,54.5539 C17.534634,54.5539 16.5172184,54.1324727 15.7670729,53.3823272 C15.0169273,52.6321816 14.5955,51.614766 14.5955,50.5539 Z M16.5955,49.9939189 L14.5955,49.9936812 C14.5956111,49.0590076 14.9670248,48.1626619 15.6280305,47.5018395 C16.2890362,46.8410171 17.1854848,46.4698519 18.12,46.47 L48.4045,46.47 L48.4045,48.47 L18.1198415,48.47 C17.7156146,48.469936 17.3279192,48.6304572 17.042048,48.9162491 C16.7561767,49.2020411 16.595548,49.589692 16.5955,49.9939189 Z M21.9325,47.4697 L19.9325,47.4697 L19.9325,10.4461 L21.9325,10.4461 L21.9325,47.4697 Z M41.765,22.3108 L41.765,24.3108 L26.9905,24.3108 L26.9905,22.3108 L41.765,22.3108 Z M41.765,28.3211 L41.765,30.3211 L26.9905,30.3211 L26.9905,28.3211 L41.765,28.3211 Z M41.765,34.3314 L41.765,36.3314 L26.9905,36.3314 L26.9905,34.3314 L41.765,34.3314 Z" />
      </svg>
    );
  }
}
