import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class ActivityTweet extends Component {
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
          d="M44.98271,26.82116c.01239.28181.01961.56361.01961.84852,0,8.67819-6.60026,18.68593-18.67458,18.68593A18.64938,18.64938,0,0,1,16.2591,43.39923a13.27982,13.27982,0,0,0,9.71974-2.719,6.574,6.574,0,0,1-6.13471-4.56258,6.23674,6.23674,0,0,0,1.23458.11871,6.6576,6.6576,0,0,0,1.73006-.2271,6.56721,6.56721,0,0,1-5.26038-6.43923v-.08464a6.44378,6.44378,0,0,0,2.96877.82271,6.55956,6.55956,0,0,1-2.02942-8.76284,18.60154,18.60154,0,0,0,13.52877,6.85419,6.49015,6.49015,0,0,1-.16619-1.32025,6.56916,6.56916,0,0,1,11.35484-4.66581,12.98945,12.98945,0,0,0,4.16929-1.58761,6.588,6.588,0,0,1-2.88619,3.62735,12.93129,12.93129,0,0,0,3.77084-1.03432,13.21738,13.21738,0,0,1-3.27639,3.40232M32,0A32,32,0,1,0,64,32,31.99977,31.99977,0,0,0,32,0"
        />
      </svg>
    );
  }
}
