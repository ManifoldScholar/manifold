import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function EditorHTML(props) {
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
    viewBox: "0 0 24 24",
    fill
  };
  return (
    <svg {...baseSvgProps} {...svgProps}>
      <path d="M10.7198 17.6699L14.7198 6.66987L13.78 6.32812L9.78003 17.3281L10.7198 17.6699Z" />
      <path d="M2.95718 11.9991L7.60363 7.35261L6.89652 6.64551L1.54297 11.9991L6.89652 17.3526L7.60363 16.6455L2.95718 11.9991Z" />
      <path d="M21.5428 11.9991L16.8964 7.35261L17.6035 6.64551L22.957 11.9991L17.6035 17.3526L16.8964 16.6455L21.5428 11.9991Z" />
    </svg>
  );
}

EditorHTML.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stroke: PropTypes.string,
  fill: PropTypes.string,
  svgProps: PropTypes.object
};

export default EditorHTML;
