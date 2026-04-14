import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class BEResourcesBoxes extends Component {
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
        <path d="M19.381104,42.2037638 L21.381096,42.2094362 L21.340396,56.5594363 L19.340404,56.5537638 L19.381104,42.2037638 Z M7.94412447,36.1830973 L8.94387546,34.4509027 L20.8809755,41.3405027 L19.8812245,43.0726973 L7.94412447,36.1830973 Z M42.957404,42.2037638 L44.957396,42.2094362 L44.916696,56.5594363 L42.916704,56.5537638 L42.957404,42.2037638 Z M55.0536703,34.5801239 L56.0583298,36.3094761 L44.4190298,43.0712761 L43.4143702,41.3419239 L55.0536703,34.5801239 Z M30.9816031,49.2185031 L31.0183892,36.0214972 L20.0846359,29.7105681 L9.44235692,35.8934954 L9.40465112,49.0905261 L20.3383857,55.4014444 L30.9816031,49.2185031 Z M7.40134881,50.2434739 L7.44564301,34.7405046 L20.0813641,27.3994319 L33.0216108,34.8685028 L32.9783969,50.3714969 L20.3416143,57.7125557 L7.40134881,50.2434739 Z M31.4773702,34.5801239 L32.4820298,36.3094761 L20.8427298,43.0712761 L19.8380702,41.3419239 L31.4773702,34.5801239 Z M54.5576431,49.2185047 L54.5953489,36.0214739 L43.6616143,29.7105557 L33.0183969,35.8934969 L32.9816108,49.0905029 L43.9153641,55.4014319 L54.5576431,49.2185047 Z M30.9783892,50.2434972 L31.0216031,34.7405031 L43.6583857,27.3994443 L56.5986512,34.8685261 L56.554357,50.3714954 L43.9186359,57.7125682 L30.9783892,50.2434972 Z M31.5204245,36.1830973 L32.5201755,34.4509027 L44.4572755,41.3405027 L43.4575245,43.0726973 L31.5204245,36.1830973 Z M42.6616031,28.1065031 L42.6983892,14.9094971 L31.7646359,8.59856809 L21.1223569,14.7814953 L21.0846511,27.9785261 L32.0183857,34.2894443 L42.6616031,28.1065031 Z M19.0813488,29.1314739 L19.125643,13.6285046 L31.7613641,6.28743184 L44.7016109,13.7565028 L44.6583969,29.2594969 L32.0216143,36.6005557 L19.0813488,29.1314739 Z M31.061004,21.0919638 L33.060996,21.0976362 L33.020296,35.4476362 L31.020304,35.4419638 L31.061004,21.0919638 Z M19.6241159,15.0711923 L20.6238841,13.3390077 L32.5608841,20.2287077 L31.5611159,21.9608923 L19.6241159,15.0711923 Z M43.1572702,13.4683239 L44.1619298,15.1976761 L32.5226298,21.9594761 L31.5179702,20.2301239 L43.1572702,13.4683239 Z" />
      </svg>
    );
  }
}
