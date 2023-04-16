import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function Code(props) {
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
      <path d="M23.375 14L19 18.375L18.1188 17.4938L21.6063 14L18.1188 10.5062L19 9.625L23.375 14ZM4.625 14L9 9.625L9.88125 10.5062L6.39375 14L9.88125 17.4938L9 18.375L4.625 14Z" />
    </svg>
  );
}

Code.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stroke: PropTypes.string,
  fill: PropTypes.string,
  svgProps: PropTypes.object
};

export default Code;
