import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class ActivityEgg extends Component {
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
          d="M64.0001,31.9998a32,32,0,1,1-32-32,31.99977,31.99977,0,0,1,32,32M6.19354,33.03433h7.22581V30.96981H6.19354Zm8.59077-8.20284L7.94353,22.50375l-.66477,1.95406,6.83974,2.32774ZM7.29187,39.55934l.6658,1.95406,6.83975-2.32774-.66478-1.95407Zm43.28877-6.525h7.22581V30.96981H50.58064Zm6.14121-8.57683-.6658-1.95406-6.83974,2.32774.66477,1.95407ZM49.20217,39.18535l6.83974,2.32774.6658-1.95406L49.868,37.23128Zm-8.808,4.74188a10.3811,10.3811,0,0,1-8.39433,3.5582,10.3804,10.3804,0,0,1-8.39432-3.55717c-2.54142-3.04-3.49213-8.01342-2.54142-13.3027,1.24594-6.93471,5.67742-14.10788,10.93574-14.10788,5.25936,0,9.68981,7.17317,10.93574,14.10788a22.00812,22.00812,0,0,1,.32723,4.69677l-4.59561-4.59561-4.609,4.609-3.937-4.59355-4.78142,3.98451,1.32129,1.58659,3.21755-2.68284,4.063,4.74116,4.72568-4.72568,4.32826,4.32826a12.82039,12.82039,0,0,1-2.60129,5.953M31.99989,14.45317c-6.57755,0-11.59122,8.14451-12.96826,15.808-1.07251,5.97161.01755,11.43639,2.99046,14.99045a12.50782,12.50782,0,0,0,9.9778,4.29832,12.50638,12.50638,0,0,0,9.97781-4.29832c2.97394-3.5551,4.063-9.01884,2.99045-14.99045-1.377-7.66349-6.38968-15.808-12.96826-15.808"
        />
      </svg>
    );
  }
}
