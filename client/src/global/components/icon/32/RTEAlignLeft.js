import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function RTEAlignLeft(props) {
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
        d="M12 6H26V8H12V6ZM12 12H22V14H12V12ZM12 18H26V20H12V18ZM12 24H22V26H12V24ZM6 4H8V28H6V4Z"
        fill="currentColor"
      />
    </svg>
  );
}

RTEAlignLeft.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stroke: PropTypes.string,
  fill: PropTypes.string,
  svgProps: PropTypes.object
};

export default RTEAlignLeft;
