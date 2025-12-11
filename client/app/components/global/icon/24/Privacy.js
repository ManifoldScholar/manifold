import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Privacy extends Component {
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
          clipRule="evenodd"
          d="m12 1.899.277.185c2.175 1.45 5.602 2.556 7.805 2.923l.418.07V12c0 3.596-2.136 6.1-4.196 7.678a16.687 16.687 0 0 1-3.773 2.154c-.175.071-.352.136-.531.197a10.655 10.655 0 0 1-.531-.197 16.686 16.686 0 0 1-3.773-2.154C5.636 18.101 3.5 15.596 3.5 12V5.076l.418-.07c2.203-.366 5.63-1.473 7.805-2.922L12 1.899Zm0 19.068.156-.062a15.679 15.679 0 0 0 3.54-2.02c1.94-1.486 3.804-3.73 3.804-6.885V5.918c-2.2-.425-5.317-1.453-7.5-2.823-2.183 1.37-5.3 2.398-7.5 2.823V12c0 3.154 1.865 5.4 3.804 6.884A15.679 15.679 0 0 0 12 20.967Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="m16.206 9.958-4.685 5.27L8.293 12 9 11.293l2.479 2.479 3.98-4.478.747.664Z"
          fill="currentColor"
        />
      </svg>
    );
  }
}
