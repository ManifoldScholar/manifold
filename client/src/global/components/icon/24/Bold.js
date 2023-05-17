import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function Bold(props) {
  const { className, size, fill, svgProps } = props;

  const getSize = () => {
    if (size === "inherit") return null;
    if (!size || size === "default") return 24;
    return size;
  };
  const baseSvgProps = {
    xmlns: "http://www.w3.org/2000/svg",
    className: classNames("manicon-svg", className),
    width: getSize(),
    height: getSize(),
    viewBox: "2 2 24 24",
    fill
  };
  return (
    <svg {...baseSvgProps} {...svgProps}>
      <path d="M15.4062 19.625H9.625V8.375H14.9375C15.5639 8.37504 16.1771 8.55435 16.7048 8.89174C17.2325 9.22914 17.6526 9.71052 17.9155 10.279C18.1784 10.8475 18.2731 11.4794 18.1884 12.1C18.1037 12.7206 17.8431 13.304 17.4375 13.7812C17.9673 14.205 18.3528 14.7825 18.5408 15.4344C18.7289 16.0862 18.7102 16.7803 18.4875 17.4211C18.2647 18.0619 17.8488 18.6179 17.297 19.0126C16.7452 19.4073 16.0847 19.6213 15.4062 19.625ZM11.5 17.75H15.3937C15.5784 17.75 15.7613 17.7136 15.9319 17.643C16.1025 17.5723 16.2575 17.4687 16.3881 17.3381C16.5187 17.2075 16.6223 17.0525 16.693 16.8819C16.7636 16.7113 16.8 16.5284 16.8 16.3438C16.8 16.1591 16.7636 15.9762 16.693 15.8056C16.6223 15.635 16.5187 15.48 16.3881 15.3494C16.2575 15.2188 16.1025 15.1152 15.9319 15.0445C15.7613 14.9739 15.5784 14.9375 15.3937 14.9375H11.5V17.75ZM11.5 13.0625H14.9375C15.1222 13.0625 15.305 13.0261 15.4756 12.9555C15.6463 12.8848 15.8013 12.7812 15.9319 12.6506C16.0625 12.52 16.166 12.365 16.2367 12.1944C16.3074 12.0238 16.3438 11.8409 16.3438 11.6562C16.3438 11.4716 16.3074 11.2887 16.2367 11.1181C16.166 10.9475 16.0625 10.7925 15.9319 10.6619C15.8013 10.5313 15.6463 10.4277 15.4756 10.357C15.305 10.2864 15.1222 10.25 14.9375 10.25H11.5V13.0625Z" />
    </svg>
  );
}

Bold.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stroke: PropTypes.string,
  fill: PropTypes.string,
  svgProps: PropTypes.object
};

export default Bold;
