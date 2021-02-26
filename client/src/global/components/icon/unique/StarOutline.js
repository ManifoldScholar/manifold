import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class StarFill extends Component {
  static displayName = "Icon.StarFill";

  static propTypes = {
    iconClass: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fill: PropTypes.string,
    stroke: PropTypes.string,
    svgProps: PropTypes.object
  };

  static defaultProps = {
    iconClass: "",
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
    const { iconClass } = this.props;
    return classnames("manicon-svg", iconClass);
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
        <path d="M17.74446,0c3.56607,0,4.85922.3713,6.16292,1.06853a7.26913,7.26913,0,0,1,3.02409,3.02409l.13959.27033C27.67815,5.5855,28,6.9354,28,10.25554v7.48892l-.00528.70612c-.04748,3.03837-.41411,4.243-1.06325,5.4568a7.26913,7.26913,0,0,1-3.02409,3.02409l-.27033.13959C22.4145,27.67815,21.0646,28,17.74446,28H10.25554l-.70613-.00528c-3.03836-.04748-4.243-.41411-5.45679-1.06325a7.26913,7.26913,0,0,1-3.02409-3.02409l-.13959-.27033c-.5846-1.17727-.90471-2.47263-.92762-5.5317L0,10.25554C0,6.68947.3713,5.39632,1.06853,4.09262A7.26913,7.26913,0,0,1,4.09262,1.06853L4.363.92894C5.54022.34434,6.83558.02423,9.89465.00132ZM10.25554,1c-3.1003,0-4.37438.246-5.69132.95034A6.26941,6.26941,0,0,0,1.95034,4.56422l-.15449.304a10.47007,10.47007,0,0,0-.79139,4.70343L1,10.25554v7.48892c0,3.1003.246,4.37438.95034,5.69132a6.26941,6.26941,0,0,0,2.61388,2.61388l.304.15449a10.47007,10.47007,0,0,0,4.70343.79139L10.25554,27h7.48892l.68389-.00446c2.61268-.0361,3.7918-.29575,5.00743-.94588a6.26941,6.26941,0,0,0,2.61388-2.61388l.15449-.304a10.47007,10.47007,0,0,0,.79139-4.70343L27,17.74446V10.25554l-.00446-.68389c-.0361-2.61268-.29575-3.7918-.94588-5.00743a6.26941,6.26941,0,0,0-2.61388-2.61388l-.304-.15449c-1.16893-.56178-2.41684-.77773-5.03759-.79475Zm3.28335,4.30811a.5.5,0,0,1,.92346.00009h0L16.677,10.64l5.86314.47333a.50044.50044,0,0,1,.34029.82364h0l-.06243.0606L18.336,15.691l1.403,5.68928a.50043.50043,0,0,1-.673.58376h0l-.07725-.03992L14,18.809,9.01119,21.92414a.50043.50043,0,0,1-.76413-.458h0l.01391-.08583L9.663,15.691,5.182,11.99757a.50044.50044,0,0,1,.192-.87024h0l.08587-.014L11.322,10.64ZM14,6.803l-1.87128,4.50394a.5.5,0,0,1-.42157.3065h0L6.771,12.011l3.77168,3.10879a.5.5,0,0,1,.18135.41177h0l-.01389.09379L9.526,20.422l4.20983-2.626a.50006.50006,0,0,1,.44535-.04212h0l.08423.04215L18.473,20.422l-1.18314-4.79665a.50006.50006,0,0,1,.10033-.43862h0l.06713-.06694L21.228,12.011l-4.93515-.39756a.5.5,0,0,1-.37838-.22479h0l-.04323-.08179Z" />
      </svg>
    );
  }
}
