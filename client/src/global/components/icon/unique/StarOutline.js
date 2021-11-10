import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class StarFill extends Component {
  static displayName = "Icon.StarFill";

  static propTypes = {
    className: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fill: PropTypes.string,
    stroke: PropTypes.string,
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
    return 28;
  }

  get defaultWidth() {
    return 28;
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
    return "0 0 28 28";
  }

  get classes() {
    const { className } = this.props;
    return classnames("manicon-svg", "icon-star-outline", className);
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
        <path d="M17.61073.5c3.43871,0,4.68568.358,5.94282,1.03037a7.0096,7.0096,0,0,1,2.91608,2.91608l.1346.26068C27.18964,5.886,27.5,7.18771,27.5,10.38927v7.22146l-.00509.6809c-.04579,2.92986-.39932,4.09147-1.02528,5.26192a7.0096,7.0096,0,0,1-2.91608,2.91608l-.26068.1346c-1.17888.58541-2.48058.89577-5.68214.89577H10.38927l-.68091-.00509c-2.92985-.04579-4.09146-.39932-5.26191-1.02528a7.0096,7.0096,0,0,1-2.91608-2.91608l-.1346-.26068C.832,22.15765.52337,20.90854.50128,17.95873L.5,10.38927C.5,6.95056.858,5.7036,1.53037,4.44645A7.0096,7.0096,0,0,1,4.44645,1.53037l.26068-.1346C5.84235.832,7.09146.52337,10.04127.50128Zm-7.22146.96429c-2.98958,0-4.21816.23725-5.48806.9164A6.04541,6.04541,0,0,0,2.38069,4.90121l-.149.29314a10.09621,10.09621,0,0,0-.76312,4.53546l-.0043.65946v7.22146c0,2.98958.23725,4.21815.9164,5.48806a6.04547,6.04547,0,0,0,2.52052,2.52052l.29314.149a10.09621,10.09621,0,0,0,4.53546.76312l.65946.0043h7.22146l.65946-.0043c2.51937-.03481,3.65638-.28519,4.8286-.9121a6.04553,6.04553,0,0,0,2.52052-2.52052l.149-.29314a10.09621,10.09621,0,0,0,.76312-4.53546l.0043-.65946V10.38927l-.0043-.65946c-.03481-2.51937-.28519-3.65638-.9121-4.8286a6.04547,6.04547,0,0,0-2.52052-2.52052l-.29314-.149c-1.12719-.54172-2.33053-.75-4.85768-.76636Zm3.16608,4.15425a.48215.48215,0,0,1,.89049.00008h0L16.58139,10.76l5.65374.45643a.48256.48256,0,0,1,.32814.79422h0l-.0602.05843-4.32193,3.56153,1.35293,5.48609a.48256.48256,0,0,1-.649.56291h0l-.07449-.0385L14,18.63725,9.18936,21.64114a.48256.48256,0,0,1-.73684-.44168h0l.01341-.08276,1.352-5.48609-4.321-3.56153a.48256.48256,0,0,1,.18513-.83916h0l.08281-.01349L11.41764,10.76ZM14,7.06l-1.80445,4.34308a.48214.48214,0,0,1-.40652.29555h0L7.02918,12.082l3.637,2.99775a.48221.48221,0,0,1,.17487.39708h0l-.01339.09043L9.68579,20.19264l4.05947-2.53225a.48222.48222,0,0,1,.42945-.04062h0l.08122.04065,4.05732,2.53222L17.17236,15.5673a.48223.48223,0,0,1,.09675-.423h0l.06473-.06456,3.636-2.99775L16.211,11.69867a.48215.48215,0,0,1-.36487-.21676h0l-.04169-.07887Z" />
      </svg>
    );
  }
}
