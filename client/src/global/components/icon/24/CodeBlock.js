import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function CodeBlock(props) {
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
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.6253 8.37496H18.0628V7.12496H19.6253C20.6608 7.12496 21.5003 7.96442 21.5003 8.99996V19.625C21.5003 20.6605 20.6608 21.5 19.6253 21.5H8.37528C7.33975 21.5 6.50028 20.6605 6.50028 19.625V15.5056H7.75028V19.625C7.75028 19.9701 8.03011 20.25 8.37528 20.25H19.6253C19.9705 20.25 20.2503 19.9701 20.2503 19.625V8.99996C20.2503 8.65478 19.9705 8.37496 19.6253 8.37496Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.9766 10.25L13.8457 7.85268L14.7799 7.02223L17.649 10.25L14.7799 13.4777L13.8457 12.6472L15.9766 10.25Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.33651 10.25L9.46742 7.85268L8.53315 7.02223L5.66406 10.25L8.53315 13.4777L9.46742 12.6472L7.33651 10.25Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.0485 6.94522L11.486 14.1327L10.2645 13.8672L11.827 6.67969L13.0485 6.94522Z"
      />
    </svg>
  );
}

CodeBlock.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stroke: PropTypes.string,
  fill: PropTypes.string,
  svgProps: PropTypes.object
};

export default CodeBlock;
