import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Share32 extends Component {
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
        <path d="M10.5832,5.5004 C12.2854914,5.5004 13.6662,6.88072723 13.6662,8.5834 C13.6662,9.07390507 13.5516153,9.53765875 13.3477671,9.94936719 L19.043768,14.0282994 C19.6018737,13.4687077 20.3738256,13.1225 21.2268,13.1225 C22.9290914,13.1225 24.3098,14.5028272 24.3098,16.2055 C24.3098,17.9081728 22.9290914,19.2885 21.2268,19.2885 C20.3738256,19.2885 19.6018737,18.9422923 19.043768,18.3827006 L13.3477671,22.4616328 C13.5516153,22.8733412 13.6662,23.3370949 13.6662,23.8276 C13.6662,25.5302728 12.2854914,26.9106 10.5832,26.9106 C8.88021799,26.9106 7.5002,25.530582 7.5002,23.8276 C7.5002,22.124618 8.88021799,20.7446 10.5832,20.7446 C11.4353423,20.7446 12.2069006,21.0904904 12.7650184,21.6495585 L18.4616087,17.5705885 C18.2581394,17.159124 18.1438,16.6956914 18.1438,16.2055 C18.1438,15.7153086 18.2581394,15.251876 18.4616087,14.8404115 L12.7659735,10.7604844 C12.207781,11.3201148 11.4358285,11.6664 10.5832,11.6664 C8.88021799,11.6664 7.5002,10.286382 7.5002,8.5834 C7.5002,6.88041799 8.88021799,5.5004 10.5832,5.5004 Z M10.5832,21.9106 C9.52418201,21.9106 8.6662,22.768582 8.6662,23.8276 C8.6662,24.886618 9.52418201,25.7446 10.5832,25.7446 C11.6415994,25.7446 12.5002,24.8862366 12.5002,23.8276 C12.5002,22.7689634 11.6415994,21.9106 10.5832,21.9106 Z M21.2268,14.2885 C20.167782,14.2885 19.3098,15.146482 19.3098,16.2055 C19.3098,17.264518 20.167782,18.1225 21.2268,18.1225 C22.2851994,18.1225 23.1438,17.2641366 23.1438,16.2055 C23.1438,15.1468634 22.2851994,14.2885 21.2268,14.2885 Z M10.5832,6.6664 C9.52418201,6.6664 8.6662,7.52438201 8.6662,8.5834 C8.6662,9.64241799 9.52418201,10.5004 10.5832,10.5004 C11.6415994,10.5004 12.5002,9.64203662 12.5002,8.5834 C12.5002,7.52476338 11.6415994,6.6664 10.5832,6.6664 Z" />
      </svg>
    );
  }
}
