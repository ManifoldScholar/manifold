import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class InteractHighlight extends Component {
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
    return 24;
  }

  get defaultWidth() {
    return 24;
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
    return "0 0 24 24";
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
        <path d="M8.50069,3.4612l.86382.5038L7.98171,6.3342l10.482,5.784,1.39393-2.38992.86392.50364L18.359,14.28439A2.75246,2.75246,0,0,1,16.47466,15.654l-.18546.02927-3.07756.38207a2.08966,2.08966,0,0,0-1.24482.778l-.07144.11229-.41964.7599-1.001,1.83464,9.38191-.061.00655,1-9.98146.064-5.958.04892,2.546-4.64692-.00126-.00089.84251-1.528a2.09435,2.09435,0,0,0,.11043-1.4355L7.363,12.83767,6.04524,10.0321a2.75109,2.75109,0,0,1-.006-2.32568l.09244-.18322Zm-1.155,12.977L5.6182,19.5883l3.713-.03.84751-1.5561Zm.132-9.24-.47612.81807a1.7513,1.7513,0,0,0-.11531,1.43581l.06388.15445,1.31806,2.80613a3.06457,3.06457,0,0,1,.00028,2.33052l-.082.16634-.36025.65178,2.833,1.564.36076-.653a3.061,3.061,0,0,1,1.91081-1.37336l.15823-.026,3.07761-.38208a1.75193,1.75193,0,0,0,1.23354-.75548l.08949-.14507.47007-.80808Z" />
      </svg>
    );
  }
}
