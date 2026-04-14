import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class FeatureMeasure extends Component {
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
        <path d="M16.0307126,6 C17.90995,6 19.433805,7.52385498 19.433805,9.40309246 C19.433805,10.6256478 18.7888679,11.6977956 17.8207143,12.297815 L23.5400844,25.2986514 L22.6247512,25.7013486 L19.9371097,19.5929761 C18.6706475,20.2534321 17.2589174,20.6043565 15.7973978,20.6043565 C14.4546597,20.6043565 13.1601898,20.307101 11.9899297,19.7582221 L9.3752463,25.7007502 L8.45991813,25.2980414 L11.1068232,19.2818187 C10.3277427,18.8032666 9.62073018,18.2046013 9.0127063,17.5019988 L8.82116801,17.2731659 L9.59844139,16.6440029 C10.1462342,17.3207509 10.7936586,17.8970747 11.5131587,18.356412 L14.1924066,12.2671178 C13.2516575,11.6616852 12.6286271,10.6051363 12.6286271,9.40309246 C12.6286271,7.52371648 14.1516135,6 16.0307126,6 Z M15.1040404,12.678426 L12.3919142,18.8421649 C13.4374877,19.3365678 14.5954835,19.6043565 15.7973978,19.6043565 C17.1133874,19.6043565 18.3822194,19.2847957 19.518131,18.6834902 L19.5329181,18.675 L16.9016588,12.6936772 C16.6815115,12.751807 16.4526329,12.7884259 16.2174084,12.8011487 L16.0307126,12.8061849 C15.7094709,12.8061849 15.3986368,12.7616533 15.1040404,12.678426 Z M16.0307126,7 C14.7040055,7 13.6286271,8.07589397 13.6286271,9.40309246 C13.6286271,10.7302909 14.7040055,11.8061849 16.0307126,11.8061849 C17.3576653,11.8061849 18.433805,10.7300452 18.433805,9.40309246 C18.433805,8.07613972 17.3576653,7 16.0307126,7 Z" />
      </svg>
    );
  }
}
