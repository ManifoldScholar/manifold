import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function Italic(props) {
  const { className, size, fill, svgProps } = props;

  const getSize = () => {
    if (size === "inherit") return null;
    if (!size || size === "default") return 16;
    return size;
  };
  const baseSvgProps = {
    xmlns: "http://www.w3.org/2000/svg",
    className: classNames("manicon-svg", className),
    width: getSize(),
    height: getSize(),
    viewBox: "0 0 16 16",
    fill
  };
  return (
    <svg {...baseSvgProps} {...svgProps}>
      <path d="M5.47863 2C5.40342 2 5.34188 2.06136 5.34188 2.13636V3.22727C5.34188 3.30227 5.40342 3.36364 5.47863 3.36364H8.57607L5.9094 12.6364H3.13675C3.06154 12.6364 3 12.6977 3 12.7727V13.8636C3 13.9386 3.06154 14 3.13675 14H10.5214C10.5966 14 10.6581 13.9386 10.6581 13.8636V12.7727C10.6581 12.6977 10.5966 12.6364 10.5214 12.6364H7.33162L9.99829 3.36364H12.8632C12.9385 3.36364 13 3.30227 13 3.22727V2.13636C13 2.06136 12.9385 2 12.8632 2H5.47863Z" />
    </svg>
  );
}

Italic.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stroke: PropTypes.string,
  fill: PropTypes.string,
  svgProps: PropTypes.object
};

export default Italic;
