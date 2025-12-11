import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function Redo(props) {
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
      <path d="M11.5 10.25H19.1156L16.8737 8.00875L17.75 7.125L21.5 10.875L17.75 14.625L16.8737 13.7406L19.1137 11.5H11.5C10.5054 11.5 9.55161 11.8951 8.84835 12.5983C8.14509 13.3016 7.75 14.2554 7.75 15.25C7.75 16.2446 8.14509 17.1984 8.84835 17.9017C9.55161 18.6049 10.5054 19 11.5 19H16.5V20.25H11.5C10.1739 20.25 8.90215 19.7232 7.96447 18.7855C7.02678 17.8479 6.5 16.5761 6.5 15.25C6.5 13.9239 7.02678 12.6521 7.96447 11.7145C8.90215 10.7768 10.1739 10.25 11.5 10.25Z" />
    </svg>
  );
}

Redo.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stroke: PropTypes.string,
  fill: PropTypes.string,
  svgProps: PropTypes.object
};

export default Redo;
