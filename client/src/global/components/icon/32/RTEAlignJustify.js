import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function RTEAlignJustify(props) {
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
        d="M6 6H26V8H6V6ZM6 12H26V14H6V12ZM6 18H26V20H6V18ZM6 24H26V26H6V24Z"
        fill="currentColor"
      />
    </svg>
  );
}

RTEAlignJustify.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stroke: PropTypes.string,
  fill: PropTypes.string,
  svgProps: PropTypes.object
};

export default RTEAlignJustify;
