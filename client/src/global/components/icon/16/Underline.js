import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function Underline(props) {
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
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.125 12.7609C3.05625 12.7609 3 12.8163 3 12.8848V13.8761C3 13.9446 3.05625 14 3.125 14H12.875C12.9438 14 13 13.9446 13 13.8761V12.8848C13 12.8163 12.9438 12.7609 12.875 12.7609H3.125ZM10.8719 10.2793C11.6406 9.4788 12.0625 8.41413 12.0625 7.28261V2.19565C12.0625 2.08804 11.9781 2 11.875 2H10.9375C10.8344 2 10.75 2.08804 10.75 2.19565V7.28261C10.75 8.86413 9.51562 10.1522 8 10.1522C6.48438 10.1522 5.25 8.86413 5.25 7.28261V2.19565C5.25 2.08804 5.16563 2 5.0625 2H4.125C4.02188 2 3.9375 2.08804 3.9375 2.19565V7.28261C3.9375 8.41413 4.36094 9.47717 5.12813 10.2793C5.89531 11.0815 6.91563 11.5217 8 11.5217C9.08437 11.5217 10.1031 11.0799 10.8719 10.2793Z"
      />
    </svg>
  );
}

Underline.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stroke: PropTypes.string,
  fill: PropTypes.string,
  svgProps: PropTypes.object
};

export default Underline;
