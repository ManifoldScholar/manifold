import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Delete extends Component {
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
        <path d="M14.3989,3.9995a1.10216,1.10216,0,0,1,1.101,1.1h0v1.9h4.5v1h-2.047l-1.055,10.587a1.42949,1.42949,0,0,1-1.418,1.413h-6.98a1.44342,1.44342,0,0,1-1.42-1.463h0L6.0469,7.9995H3.9999v-1h4.5V5.0935a1.0949,1.0949,0,0,1,1.094-1.094h4.805Zm2.549,4H7.0509l1.026,10.488a.46381.46381,0,0,0,.423.512h6.98a.4435.4435,0,0,0,.42-.463h0ZM11,9.999v7H10v-7Zm3,0v7H13v-7Zm.3989-4.9995H9.5939a.09454.09454,0,0,0-.094.094h0v1.906h5v-1.9a.10319.10319,0,0,0-.101-.1Z" />
      </svg>
    );
  }
}
