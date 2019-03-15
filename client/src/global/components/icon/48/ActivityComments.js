import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class ActivityComments extends Component {
  static propTypes = {
    iconClass: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stroke: PropTypes.string,
    fill: PropTypes.string,
    svgProps: PropTypes.object
  };

  static defaultProps = {
    iconClass: "",
    size: "inherit",
    stroke: "currentColor",
    fill: "currentColor",
    svgProps: {}
  };

  get defaultHeight() {
    return 48;
  }

  get defaultWidth() {
    return 48;
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
    return "0 0 48 48";
  }

  get classes() {
    const { iconClass } = this.props;
    return classnames("manicon-svg", iconClass);
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
            d="M47,24 C47,36.7027083 36.7027083,47 24,47 C11.2972917,47 1,36.7027083 1,24 C1,11.2972917 11.2972917,1 24,1 C36.7027083,1 47,11.2972917 47,24 M35,32 L31.497,32 L31.166,29.942 C30.892,28.237 29.474,27 27.796,27 L20.196,27 C18.518,27 17.101,28.237 16.826,29.942 L16.495,32 L13,32 L13,13 L35,13 L35,32 Z M27.78,32 L21,37.771 L21,32 L17.507,32 L17.813,30.101 C18.01,28.884 19.011,28 20.196,28 L27.796,28 C28.981,28 29.982,28.884 30.179,30.101 L30.484,32 L27.78,32 Z M24,16.9941 C25.93,16.9941 27.5,18.5641 27.5,20.4941 C27.5,22.4241 25.93,23.9941 24,23.9941 C22.07,23.9941 20.5,22.4241 20.5,20.4941 C20.5,18.5641 22.07,16.9941 24,16.9941 M24,24.9941 C26.481,24.9941 28.5,22.9751 28.5,20.4941 C28.5,18.0131 26.481,15.9941 24,15.9941 C21.519,15.9941 19.5,18.0131 19.5,20.4941 C19.5,22.9751 21.519,24.9941 24,24.9941 M12,12 L12,33 L20,33 L20,39.936 L28.148,33 L36,33 L36,12 L12,12 Z"
          />
          <path
            fill={this.fill}
            d="M47,24 C47,36.7027083 36.7027083,47 24,47 C11.2972917,47 1,36.7027083 1,24 C1,11.2972917 11.2972917,1 24,1 C36.7027083,1 47,11.2972917 47,24 M35,32 L31.497,32 L31.166,29.942 C30.892,28.237 29.474,27 27.796,27 L20.196,27 C18.518,27 17.101,28.237 16.826,29.942 L16.495,32 L13,32 L13,13 L35,13 L35,32 Z M27.78,32 L21,37.771 L21,32 L17.507,32 L17.813,30.101 C18.01,28.884 19.011,28 20.196,28 L27.796,28 C28.981,28 29.982,28.884 30.179,30.101 L30.484,32 L27.78,32 Z M24,16.9941 C25.93,16.9941 27.5,18.5641 27.5,20.4941 C27.5,22.4241 25.93,23.9941 24,23.9941 C22.07,23.9941 20.5,22.4241 20.5,20.4941 C20.5,18.5641 22.07,16.9941 24,16.9941 M24,24.9941 C26.481,24.9941 28.5,22.9751 28.5,20.4941 C28.5,18.0131 26.481,15.9941 24,15.9941 C21.519,15.9941 19.5,18.0131 19.5,20.4941 C19.5,22.9751 21.519,24.9941 24,24.9941 M12,12 L12,33 L20,33 L20,39.936 L28.148,33 L36,33 L36,12 L12,12 Z"
          />
        </g>
      </svg>
    );
  }
}
