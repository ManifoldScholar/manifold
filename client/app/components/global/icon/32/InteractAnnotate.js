import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class InteractAnnotate extends Component {
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
        <path d="M21.2303466,5.07114661 C22.1986469,4.10284631 23.7804059,4.10284631 24.7476822,5.07137552 L24.7476822,5.07137552 L27.0204534,7.34414661 C27.9187155,8.24240876 27.9187155,9.69599124 27.0204534,10.5942534 L27.0204534,10.5942534 L24.4178244,13.19595 L24.4181534,13.1969534 L11.5139042,26.1012025 L4.30582437,27.6520769 L5.85782657,20.4440667 L18.7610466,7.54084661 Z M6.75482437,21.01995 L5.60844977,26.3485014 L10.9368244,25.20095 L6.75482437,21.01995 Z M19.4538244,8.26195 L6.77244977,20.9425014 L6.77182437,20.94295 L7.43261172,20.2832049 L11.6756117,24.5252049 L23.6958244,12.50395 L19.4538244,8.26195 Z M19.8069466,11.4441466 L20.5140534,12.1512534 L11.3220534,21.3432534 L10.6149466,20.6361466 L19.8069466,11.4441466 Z M24.0401178,5.77802448 C23.4633941,5.20055369 22.5151531,5.20055369 21.9374534,5.77825339 L21.9374534,5.77825339 L20.1604498,7.55450142 L24.4024498,11.7965014 L26.3133466,9.88714661 C26.7872353,9.41325795 26.8188279,8.66699056 26.4081243,8.15678473 L26.4081243,8.15678473 L26.3133466,8.05125339 Z" />
      </svg>
    );
  }
}
