import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function RTEAlignRight(props) {
  const { className, size, fill, svgProps } = props;

  const getSize = () => {
    if (size === "inherit") return null;
    if (!size || size === "default") return 32;
    return size;
  };
  const baseSvgProps = {
    xmlns: "http://www.w3.org/2000/svg",
    className: classNames("manicon-svg", className),
    width: getSize(),
    height: getSize(),
    viewBox: "0 0 32 32",
    fill
  };
  return (
    <svg {...baseSvgProps} {...svgProps}>
      <path
        d="M6 6H20V8H6V6ZM10 12H20V14H10V12ZM6 18H20V20H6V18ZM10 24H20V26H10V24ZM24 4H26V28H24V4Z"
        fill="currentColor"
      />
    </svg>
  );
}

RTEAlignRight.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stroke: PropTypes.string,
  fill: PropTypes.string,
  svgProps: PropTypes.object
};

export default RTEAlignRight;
