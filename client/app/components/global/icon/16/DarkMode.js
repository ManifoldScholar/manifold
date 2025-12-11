import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function DarkMode(props) {
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
    viewBox: "-4 -4 24 24",
    fill
  };
  return (
    <svg {...baseSvgProps} {...svgProps}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.9303 5.00452C11.9303 3.82205 11.6191 2.71301 11.08 1.75C13.1195 2.89159 14.5014 5.07128 14.5014 7.5756C14.5014 11.2624 11.5122 14.2515 7.82545 14.2515C5.32114 14.2515 3.14144 12.8713 1.99902 10.831C2.96203 11.37 4.0719 11.6805 5.25438 11.6805C8.94117 11.6805 11.9303 8.69215 11.9303 5.00452ZM4.61833 6.67117L2.53043 6.88731C2.21916 6.91985 2.04809 6.53432 2.28092 6.32486L3.84309 4.92291L2.9919 3.00441C2.86506 2.71818 3.17883 2.43612 3.45004 2.59301L5.2659 3.6453L6.82723 2.24335C7.06089 2.03473 7.42556 2.24502 7.35964 2.55128L6.9207 4.60413L8.73655 5.6556C9.00776 5.81248 8.91931 6.22472 8.60804 6.25726L6.52014 6.47423L6.0812 8.52625C6.01527 8.83251 5.59636 8.8759 5.46868 8.58967L4.61833 6.67117Z"
      />
    </svg>
  );
}

DarkMode.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stroke: PropTypes.string,
  fill: PropTypes.string,
  svgProps: PropTypes.object
};

export default DarkMode;
