import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class ActivityText extends Component {
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
          d="M64,32A32,32,0,1,1,32,0,32.00043,32.00043,0,0,1,64,32M22.259,39.22808h12.3871V37.16356H22.259Zm0-4.129H37.74286V33.03453H22.259Zm0-4.129h12.3871V28.9055H22.259Zm0-4.129H37.74286V24.77646H22.259ZM42.90426,51.615a6.19355,6.19355,0,1,1,6.19355-6.19355A6.19979,6.19979,0,0,1,42.90426,51.615Zm-23.74194-4.129V13.42142H35.535c.04335,0,.08981.05987.11768.14245l-.13626.1249.16206.17652v7.81419h7.08232c.05884,0,.14349.08878.14349.22917v15.2547a8.22295,8.22295,0,0,0-7.98555,10.32258ZM37.743,16.11355,40.95742,19.615H37.743Zm7.2258,21.32232V21.90865a2.3354,2.3354,0,0,0-.60283-1.56594l.03406-.031L37.62013,12.927A2.21489,2.21489,0,0,0,35.535,11.3569H17.09781V49.55045H35.67845v-.14038a8.25386,8.25386,0,1,0,9.29032-11.9742Zm-1.03225,3.85652H41.872v3.09677H38.77523v2.06452H41.872v3.09677h2.06452V46.45368h3.09677V44.38916H43.93652Z"
        />
      </svg>
    );
  }
}
