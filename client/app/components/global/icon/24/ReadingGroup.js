import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class ReadingGroup extends Component {
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
      viewBox: this.viewBox
    };

    const svgProps = Object.assign(baseSvgProps, this.props.svgProps);

    return (
      <svg {...svgProps}>
        <path
          fill={this.fill}
          d="M18.0001,3 C16.8971,3 16.0001,3.897 16.0001,5 C16.0001,6.103 16.8971,7 18.0001,7 C19.1031,7 20.0001,6.103 20.0001,5 C20.0001,3.897 19.1031,3 18.0001,3 Z M18.0001,8 C16.3461,8 15.0001,6.654 15.0001,5 C15.0001,3.346 16.3461,2 18.0001,2 C19.6541,2 21.0001,3.346 21.0001,5 C21.0001,6.654 19.6541,8 18.0001,8 Z M6.0001,3 C4.8971,3 4.0001,3.897 4.0001,5 C4.0001,6.103 4.8971,7 6.0001,7 C7.1031,7 8.0001,6.103 8.0001,5 C8.0001,3.897 7.1031,3 6.0001,3 Z M6.0001,8 C4.3461,8 3.0001,6.654 3.0001,5 C3.0001,3.346 4.3461,2 6.0001,2 C7.6541,2 9.0001,3.346 9.0001,5 C9.0001,6.654 7.6541,8 6.0001,8 Z M20.5054,9 C21.8804,9 23.0004,10.119 23.0004,11.495 L23.0004,13 L22.0004,13 L22.0004,11.495 C22.0004,10.671 21.3294,10 20.5054,10 L15.9584,10 L15.9584,9 L20.5054,9 Z M8.0206,10 L3.4946,10 C2.6706,10 1.9996,10.671 1.9996,11.495 L1.9996,13 L0.9996,13 L0.9996,11.495 C0.9996,10.119 2.1196,9 3.4946,9 L8.0206,9 L8.0206,10 Z M8.0001,15.9951 L8.0001,16.3661 L12.0001,17.4771 L16.0001,16.3661 L16.0001,15.9951 C16.0001,15.1711 15.3301,14.5001 14.5051,14.5001 L9.4951,14.5001 C8.6701,14.5001 8.0001,15.1711 8.0001,15.9951 Z M17.0001,15.9951 L17.0001,16.0881 L21.5001,14.8381 L21.5001,22.0001 L20.5001,22.0001 L20.5001,16.1541 L12.5001,18.3761 L12.5001,22.0001 L11.5001,22.0001 L11.5001,18.3761 L3.5001,16.1541 L3.5001,22.0001 L2.5001,22.0001 L2.5001,14.8381 L7.0001,16.0881 L7.0001,15.9951 C7.0001,14.6191 8.1191,13.5001 9.4951,13.5001 L14.5051,13.5001 C15.8811,13.5001 17.0001,14.6191 17.0001,15.9951 Z M12.0001,7.5 C10.8971,7.5 10.0001,8.397 10.0001,9.5 C10.0001,10.603 10.8971,11.5 12.0001,11.5 C13.1031,11.5 14.0001,10.603 14.0001,9.5 C14.0001,8.397 13.1031,7.5 12.0001,7.5 Z M12.0001,12.5 C10.3461,12.5 9.0001,11.154 9.0001,9.5 C9.0001,7.846 10.3461,6.5 12.0001,6.5 C13.6541,6.5 15.0001,7.846 15.0001,9.5 C15.0001,11.154 13.6541,12.5 12.0001,12.5 Z"
        />
      </svg>
    );
  }
}
