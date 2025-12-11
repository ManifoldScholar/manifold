import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Users extends Component {
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
        <path d="M19.34,20.833 C21.0191719,20.833 22.4016314,22.1575569 22.4949768,23.8142693 L22.5,23.993 L22.5,26 L21.5,26 L21.5,23.993 C21.5,22.8577449 20.6096391,21.9180251 19.4935331,21.8384563 L19.34,21.833 L12.66,21.833 C11.5247449,21.833 10.5850251,22.7233609 10.5054563,23.8394669 L10.5,23.993 L10.5,26 L9.5,26 L9.5,23.993 C9.5,22.3138281 10.8245569,20.9313686 12.4812693,20.8380232 L12.66,20.833 L19.34,20.833 Z M27.34,14.833 C29.0191719,14.833 30.4016314,16.1575569 30.4949768,17.8142693 L30.5,17.993 L30.5,20 L29.5,20 L29.5,17.993 C29.5,16.8577449 28.6096391,15.9180251 27.4935331,15.8384563 L27.34,15.833 L20.66,15.833 L20.66,14.833 L27.34,14.833 Z M11.34,14.833 L11.34,15.833 L4.66,15.833 C3.52474488,15.833 2.58502507,16.7233609 2.50545635,17.8394669 L2.5,17.993 L2.5,20 L1.5,20 L1.5,17.993 C1.5,16.3138281 2.82455693,14.9313686 4.48126931,14.8380232 L4.66,14.833 L11.34,14.833 Z M16,11.5 C18.1171424,11.5 19.833,13.2158576 19.833,15.333 C19.833,17.4502868 18.1169981,19.167 16,19.167 C13.8830019,19.167 12.167,17.4502868 12.167,15.333 C12.167,13.2158576 13.8828576,11.5 16,11.5 Z M16,12.5 C14.4351424,12.5 13.167,13.7681424 13.167,15.333 C13.167,16.8980948 14.4353795,18.167 16,18.167 C17.5646205,18.167 18.833,16.8980948 18.833,15.333 C18.833,13.7681424 17.5648576,12.5 16,12.5 Z M24,5.5 C26.1171424,5.5 27.833,7.21585763 27.833,9.333 C27.833,11.4502868 26.1169981,13.167 24,13.167 C21.8830019,13.167 20.167,11.4502868 20.167,9.333 C20.167,7.21585763 21.8828576,5.5 24,5.5 Z M8,5.5 C10.1171424,5.5 11.833,7.21585763 11.833,9.333 C11.833,11.4502868 10.1169981,13.167 8,13.167 C5.88300193,13.167 4.167,11.4502868 4.167,9.333 C4.167,7.21585763 5.88285763,5.5 8,5.5 Z M24,6.5 C22.4351424,6.5 21.167,7.76814237 21.167,9.333 C21.167,10.8980948 22.4353795,12.167 24,12.167 C25.5646205,12.167 26.833,10.8980948 26.833,9.333 C26.833,7.76814237 25.5648576,6.5 24,6.5 Z M8,6.5 C6.43514237,6.5 5.167,7.76814237 5.167,9.333 C5.167,10.8980948 6.43537947,12.167 8,12.167 C9.56462053,12.167 10.833,10.8980948 10.833,9.333 C10.833,7.76814237 9.56485763,6.5 8,6.5 Z" />
      </svg>
    );
  }
}
