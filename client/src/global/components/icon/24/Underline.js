import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function Underline(props) {
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
      <path d="M6.5 20.25H21.5V21.5H6.5V20.25ZM14 18.375C12.8397 18.375 11.7269 17.9141 10.9064 17.0936C10.0859 16.2731 9.625 15.1603 9.625 14V7.125H10.875V14C10.875 14.8288 11.2042 15.6237 11.7903 16.2097C12.3763 16.7958 13.1712 17.125 14 17.125C14.8288 17.125 15.6237 16.7958 16.2097 16.2097C16.7958 15.6237 17.125 14.8288 17.125 14V7.125H18.375V14C18.375 15.1603 17.9141 16.2731 17.0936 17.0936C16.2731 17.9141 15.1603 18.375 14 18.375Z" />
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
