import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class NotesUnique extends Component {
  static displayName = "Icon.NotesUnique";

  static propTypes = {
    className: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
    const { className } = this.props;
    return classnames("manicon-svg", "icon-notes-unique", className);
  }

  get fill() {
    return this.props.fill;
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
          className="icon-notes-unique__background"
          d="M10.25554,0H37.74446c3.56608,0,4.85922.3713,6.16292,1.06853a7.26913,7.26913,0,0,1,3.02409,3.02409C47.6287,5.39632,48,6.68947,48,10.25554V37.74446c0,3.56608-.3713,4.85922-1.06853,6.16292a7.26913,7.26913,0,0,1-3.02409,3.02409C42.60368,47.6287,41.31054,48,37.74446,48H10.25554c-3.56607,0-4.85922-.3713-6.16292-1.06853a7.26913,7.26913,0,0,1-3.02409-3.02409C.3713,42.60368,0,41.31054,0,37.74446V10.25554C0,6.68947.3713,5.39632,1.06853,4.09262A7.26913,7.26913,0,0,1,4.09262,1.06853C5.39632.3713,6.68947,0,10.25554,0Z"
        />
        <path
          className="icon-notes-unique__foreground"
          d="M15.25,15.25V31.482A2.518,2.518,0,0,0,17.768,34H30.232a2.518,2.518,0,0,0,2.518-2.518V15.25ZM34,14V31.482a3.768,3.768,0,0,1-3.768,3.768H17.768A3.768,3.768,0,0,1,14,31.482V14ZM19.625,17.75h-1.25V11.5h1.25Zm5,0h-1.25V11.5h1.25Zm5,0h-1.25V11.5h1.25ZM29,29v1.25H19V29Zm-2.5-3.75V26.5H19V25.25ZM29,21.5v1.25H19V21.5Z"
        />
      </svg>
    );
  }
}
