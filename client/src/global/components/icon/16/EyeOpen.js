import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class EyeOpen extends Component {
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
    return 16;
  }

  get defaultWidth() {
    return 16;
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
    return "0 0 16 16";
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
      viewBox: this.viewBox
    };

    const svgProps = Object.assign(baseSvgProps, this.props.svgProps);

    return (
      <svg {...svgProps}>
        <g fill="none" fillRule="evenodd">
          <path
            fill={this.fill}
            fillRule="nonzero"
            d="M14.8364691,7.73500053 L15,8 L14.8364691,8.26499947 C14.750092,8.40497236 14.5893353,8.6387578 14.3575003,8.93535147 C13.9741863,9.42573671 13.526805,9.91558469 13.0179353,10.3737047 C11.5466138,11.6982908 9.86451829,12.5 8,12.5 C6.13548171,12.5 4.45338622,11.6982908 2.98206473,10.3737047 C2.47319503,9.91558469 2.02581365,9.42573671 1.64249973,8.93535147 C1.41066468,8.6387578 1.24990805,8.40497236 1.16353092,8.26499947 L1,8 L1.16353092,7.73500053 C1.24990805,7.59502764 1.41066468,7.3612422 1.64249973,7.06464853 C2.02581365,6.57426329 2.47319503,6.08441531 2.98206473,5.62629534 C4.45338622,4.3017092 6.13548171,3.5 8,3.5 C9.86451829,3.5 11.5466138,4.3017092 13.0179353,5.62629534 C13.526805,6.08441531 13.9741863,6.57426329 14.3575003,7.06464853 C14.5893353,7.3612422 14.750092,7.59502764 14.8364691,7.73500053 Z M13.583366,7.68535147 C13.2338748,7.23823671 12.8250313,6.79058469 12.36197,6.37370466 C11.0563459,5.1982908 9.59123629,4.5 8,4.5 C6.40876371,4.5 4.94365413,5.1982908 3.63802998,6.37370466 C3.1749687,6.79058469 2.76612517,7.23823671 2.416634,7.68535147 C2.32434989,7.80341335 2.24542535,7.9092151 2.1802466,8 C2.24542535,8.0907849 2.32434989,8.19658665 2.416634,8.31464853 C2.76612517,8.76176329 3.1749687,9.20941531 3.63802998,9.62629534 C4.94365413,10.8017092 6.40876371,11.5 8,11.5 C9.59123629,11.5 11.0563459,10.8017092 12.36197,9.62629534 C12.8250313,9.20941531 13.2338748,8.76176329 13.583366,8.31464853 C13.6756501,8.19658665 13.7545746,8.0907849 13.8197534,8 C13.7545746,7.9092151 13.6756501,7.80341335 13.583366,7.68535147 Z M10.5,8 C10.5,9.38032324 9.38045127,10.5 7.99939994,10.5 C6.61931663,10.5 5.5,9.38009125 5.5,8 C5.5,6.61990875 6.61931663,5.5 7.99939994,5.5 C9.38045127,5.5 10.5,6.61967676 10.5,8 Z M9.5,8 C9.5,7.17193591 8.82814092,6.5 7.99939994,6.5 C7.1717198,6.5 6.5,7.17207514 6.5,8 C6.5,8.82792486 7.1717198,9.5 7.99939994,9.5 C8.82814092,9.5 9.5,8.82806409 9.5,8 Z"
          />
        </g>
      </svg>
    );
  }
}
