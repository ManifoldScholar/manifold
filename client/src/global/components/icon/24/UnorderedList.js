import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function UnorderedList(props) {
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
      <path d="M8.375 11.5C9.41053 11.5 10.25 10.6605 10.25 9.625C10.25 8.58947 9.41053 7.75 8.375 7.75C7.33947 7.75 6.5 8.58947 6.5 9.625C6.5 10.6605 7.33947 11.5 8.375 11.5Z" />
      <path d="M8.375 20.25C9.41053 20.25 10.25 19.4105 10.25 18.375C10.25 17.3395 9.41053 16.5 8.375 16.5C7.33947 16.5 6.5 17.3395 6.5 18.375C6.5 19.4105 7.33947 20.25 8.375 20.25Z" />
      <path d="M14 17.75H22.75V19H14V17.75ZM14 9H22.75V10.25H14V9Z" />
    </svg>
  );
}

UnorderedList.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stroke: PropTypes.string,
  fill: PropTypes.string,
  svgProps: PropTypes.object
};

export default UnorderedList;
