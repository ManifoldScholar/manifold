import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function EditorRTE(props) {
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
      <path d="M19.25 5V8.5H18.25V6H12.75V18.5H15.25V19.5H9.25V18.5H11.75V6H6.25V8.5H5.25V5H19.25Z" />
    </svg>
  );
}

EditorRTE.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stroke: PropTypes.string,
  fill: PropTypes.string,
  svgProps: PropTypes.object
};

export default EditorRTE;
