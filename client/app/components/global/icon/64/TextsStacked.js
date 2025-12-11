import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class TextsStacked extends Component {
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
        <path d="M35.6424,8.40319996 L14.07,8.40319996 C13.5177152,8.40319996 13.07,8.85091521 13.07,9.40319997 L13.07,37.6892 C13.07,38.2414848 13.5177152,38.6892 14.07,38.6892 L35.6424,38.6892 L35.6424,8.40319996 Z M11.07,37.6892 L11.07,9.40319997 C11.07,7.74634571 12.4131457,6.40319996 14.07,6.40319996 L37.6424,6.40319996 L37.6424,40.6892 L14.07,40.6892 C12.4131457,40.6892 11.07,39.3460543 11.07,37.6892 Z M13.07,37.0228 L11.07,37.0228 C11.07,35.4266971 12.363897,34.1328 13.96,34.1328 L36.6424,34.1328 L36.6424,36.1328 L13.96,36.1328 C13.4684665,36.1328 13.07,36.5312666 13.07,37.0228 Z M43.2863,16.857 L36.4591,16.857 L36.4591,14.857 L45.2863,14.857 L45.2863,49.143 L21.7137,49.143 C20.0568457,49.143 18.7137,47.7998543 18.7137,46.143 L18.7137,39.6892 L20.7137,39.6892 L20.7137,46.143 C20.7137,46.6952848 21.1614152,47.143 21.7137,47.143 L43.2863,47.143 L43.2863,16.857 Z M20.7137,45.4766 L18.7137,45.4766 C18.7137,43.8804971 20.0075971,42.5866 21.6037,42.5866 L44.2863,42.5866 L44.2863,44.5866 L21.6037,44.5866 C21.1121666,44.5866 20.7137,44.9850666 20.7137,45.4766 Z M44.1031,25.3108 L44.1031,23.3108 L52.93,23.3108 L52.93,57.5968 L29.3576,57.5968 C27.7007457,57.5968 26.3576,56.2536543 26.3576,54.5968 L26.3576,48.143 L28.3576,48.143 L28.3576,54.5968 C28.3576,55.1490848 28.8053152,55.5968 29.3576,55.5968 L50.93,55.5968 L50.93,25.3108 L44.1031,25.3108 Z M28.3576,53.93 L26.3576,53.93 C26.3576,52.3338971 27.6514971,51.04 29.2476,51.04 L51.93,51.04 L51.93,53.04 L29.2476,53.04 C28.7560666,53.04 28.3576,53.4384666 28.3576,53.93 Z" />
      </svg>
    );
  }
}
