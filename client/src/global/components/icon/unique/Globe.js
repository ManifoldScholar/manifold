import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class IconGlobe extends Component {
  static displayName = "Icon.Globe";

  static propTypes = {
    iconClass: PropTypes.string,
    size: PropTypes.number,
    fill: PropTypes.string,
    stroke: PropTypes.string
  };

  static defaultProps = {
    size: 24,
    fill: "currentColor"
  };

  render() {
    const { iconClass, size, fill, stroke } = this.props;
    const classes = classnames("manicon-svg", iconClass);

    return (
      <svg
        className={classes}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill={fill}
        stroke={stroke}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          transform="translate(2.017 2)"
          d="M10,20H9.994A10,10,0,0,1,2.935,2.922,9.935,9.935,0,0,1,10,0h.006a10,10,0,0,1,7.06,17.078A9.941,9.941,0,0,1,10,20ZM5.867,13.5h0a10.974,10.974,0,0,0,1.448,3.669A3.824,3.824,0,0,0,9.5,18.939V13.5H5.867Zm4.633,0v5.434a4.343,4.343,0,0,0,2.587-2.447,11.725,11.725,0,0,0,1.05-2.987Zm4.646,0a12.939,12.939,0,0,1-1.175,3.454A7.782,7.782,0,0,1,12.9,18.516a8.986,8.986,0,0,0,5.4-5.016H15.146Zm-13.437,0a9.034,9.034,0,0,0,5.359,5,10.822,10.822,0,0,1-2.23-5H1.709Zm13.619-6a18.51,18.51,0,0,1,.172,2.506,18.011,18.011,0,0,1-.193,2.495h3.337a8.9,8.9,0,0,0-.005-5ZM10.5,7.5v5h3.8a16.906,16.906,0,0,0,.2-2.495A16.873,16.873,0,0,0,14.314,7.5Zm-4.8,0h0a16.138,16.138,0,0,0-.017,5H9.5v-5H5.7Zm-4.347,0h0a8.9,8.9,0,0,0,0,5H4.671A18.66,18.66,0,0,1,4.5,10a17.973,17.973,0,0,1,.192-2.5H1.356Zm11.574-6h0a10.813,10.813,0,0,1,2.231,5h3.129a9.03,9.03,0,0,0-5.36-5ZM10.5,1.06h0V6.5h3.632a10.981,10.981,0,0,0-1.448-3.67A3.823,3.823,0,0,0,10.5,1.06Zm-1,0A4.35,4.35,0,0,0,6.913,3.513,11.7,11.7,0,0,0,5.863,6.5H9.5V1.065Zm-2.4.419A9,9,0,0,0,1.7,6.5H4.854A12.9,12.9,0,0,1,6.028,3.046,7.839,7.839,0,0,1,7.1,1.484Z"
        />
      </svg>
    );
  }
}
