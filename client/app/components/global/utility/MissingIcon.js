import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class MissingIcon extends Component {
  static propTypes = {
    className: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stroke: PropTypes.string,
    fill: PropTypes.string
  };

  static defaultProps = {
    className: "",
    size: "inherit",
    stroke: "currentColor",
    fill: "currentColor"
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
    const svgProps = {
      xmlns: "http://www.w3.org/2000/svg",
      className: this.classes,
      width: this.width,
      height: this.height,
      viewBox: this.viewBox
    };

    return (
      <>
        <svg {...svgProps} style={{ backgroundColor: "yellow" }}>
          <g fill="none" fillRule="evenodd">
            <path
              fill="#39ff14"
              fillRule="nonzero"
              d="M34.599464,6.55235632 L59.0158347,51.5697026 C59.8057661,53.0261278 59.2654662,54.8471596 57.809041,55.6370911 C57.369926,55.8752569 56.8782883,56 56.3787436,56 L7.61867231,56 C5.96181806,56 4.61867231,54.6568542 4.61867231,53 C4.61867231,52.5017228 4.74278339,52.0112922 4.97979802,51.5729953 L29.3234986,6.555649 C30.1116116,5.09823897 31.9319676,4.55566648 33.3893777,5.34377943 C33.90146,5.62069444 34.32191,6.04062003 34.599464,6.55235632 Z M32,49 C33.6568542,49 35,47.6568542 35,46 C35,44.3431458 33.6568542,43 32,43 C30.3431458,43 29,44.3431458 29,46 C29,47.6568542 30.3431458,49 32,49 Z M32.982486,40 L36,24 L28,24 L30.9870897,40 L32.982486,40 Z"
            />
            <path
              fill="#39ff14"
              fillRule="nonzero"
              d="M34.599464,6.55235632 L59.0158347,51.5697026 C59.8057661,53.0261278 59.2654662,54.8471596 57.809041,55.6370911 C57.369926,55.8752569 56.8782883,56 56.3787436,56 L7.61867231,56 C5.96181806,56 4.61867231,54.6568542 4.61867231,53 C4.61867231,52.5017228 4.74278339,52.0112922 4.97979802,51.5729953 L29.3234986,6.555649 C30.1116116,5.09823897 31.9319676,4.55566648 33.3893777,5.34377943 C33.90146,5.62069444 34.32191,6.04062003 34.599464,6.55235632 Z M32,49 C33.6568542,49 35,47.6568542 35,46 C35,44.3431458 33.6568542,43 32,43 C30.3431458,43 29,44.3431458 29,46 C29,47.6568542 30.3431458,49 32,49 Z M32.982486,40 L36,24 L28,24 L30.9870897,40 L32.982486,40 Z"
            />
          </g>
        </svg>
        <br />
        <span style={{ fontSize: 10 }}>{this.props.icon}</span>
      </>
    );
  }
}
