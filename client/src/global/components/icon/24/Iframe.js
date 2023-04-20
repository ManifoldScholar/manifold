import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function Iframe(props) {
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
      <path d="M12.5801 13.1783L10.4833 15.4062L12.5801 17.6341L11.6698 18.4908L8.76669 15.4062L11.6698 12.3216L12.5801 13.1783Z" />
      <path d="M15.4199 13.1783L17.5167 15.4062L15.4199 17.6341L16.3302 18.4908L19.2333 15.4062L16.3302 12.3216L15.4199 13.1783Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.875 7.125C5.875 6.77982 6.15482 6.5 6.5 6.5H21.5C21.8452 6.5 22.125 6.77982 22.125 7.125V20.875C22.125 21.2202 21.8452 21.5 21.5 21.5H6.5C6.15482 21.5 5.875 21.2202 5.875 20.875V7.125ZM7.125 10.5625V20.25H20.875V10.5625H7.125ZM7.125 9.3125H20.875V7.75H7.125V9.3125Z"
      />
    </svg>
  );
}

Iframe.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stroke: PropTypes.string,
  fill: PropTypes.string,
  svgProps: PropTypes.object
};

export default Iframe;
