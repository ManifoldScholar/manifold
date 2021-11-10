import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class ProjectCollections extends Component {
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
          d="M15.192,51.213 L17.9,51.213 L17.9,44.693 L15.192,44.693 L15.192,51.213 Z M7.822,42.693 L7.822,34.039 L9.729,34.039 L47.175,34.039 L47.175,42.693 L13.192,42.693 L7.822,42.693 Z M11.729,25.52 L14.192,25.52 L15.066,25.52 L15.066,32.039 L11.729,32.039 L11.729,25.52 Z M16.192,17 L55.544,17 L55.544,23.52 L53.081,23.52 L16.192,23.52 L16.192,17 Z M51.081,32.039 L49.175,32.039 L47.743,32.039 L47.743,25.52 L51.081,25.52 L51.081,32.039 Z M43.401,32.04 L45.743,32.04 L45.743,25.52 L43.401,25.52 L43.401,32.04 Z M21.408,32.04 L41.401,32.04 L41.401,25.52 L21.408,25.52 L21.408,32.04 Z M17.066,32.039 L19.408,32.039 L19.408,25.519 L17.066,25.519 L17.066,32.039 Z M49.836,44.693 L49.836,51.213 L19.9,51.213 L19.9,44.693 L49.175,44.693 L49.836,44.693 Z M51.836,51.213 L54.544,51.213 L54.544,44.693 L51.836,44.693 L51.836,51.213 Z M56.544,51.213 L56.544,42.693 L49.175,42.693 L49.175,34.039 L53.081,34.039 L53.081,25.52 L57.544,25.52 L57.544,15 L14.192,15 L14.192,23.52 L9.729,23.52 L9.729,32.039 L5.822,32.039 L5.822,44.693 L13.192,44.693 L13.192,51.213 L5,51.213 L5,53.213 L59.944,53.213 L59.944,51.213 L56.544,51.213 Z M27.1726,36.2589 C26.0076,36.4389 25.2106,37.5289 25.3906,38.6929 C25.5706,39.8569 26.6606,40.6549 27.8246,40.4749 C28.9886,40.2939 29.7866,39.2039 29.6066,38.0399 C29.4266,36.8759 28.3366,36.0779 27.1726,36.2589"
        />
      </svg>
    );
  }
}
