import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function OrderedList(props) {
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
      <path d="M14 17.75H22.75V19H14V17.75ZM14 9H22.75V10.25H14V9ZM9 11.5V6.5H7.75V7.125H6.5V8.375H7.75V11.5H6.5V12.75H10.25V11.5H9ZM10.25 21.5H6.5V19C6.5 18.6685 6.6317 18.3505 6.86612 18.1161C7.10054 17.8817 7.41848 17.75 7.75 17.75H9V16.5H6.5V15.25H9C9.33152 15.25 9.64946 15.3817 9.88388 15.6161C10.1183 15.8505 10.25 16.1685 10.25 16.5V17.75C10.25 18.0815 10.1183 18.3995 9.88388 18.6339C9.64946 18.8683 9.33152 19 9 19H7.75V20.25H10.25V21.5Z" />
    </svg>
  );
}

OrderedList.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stroke: PropTypes.string,
  fill: PropTypes.string,
  svgProps: PropTypes.object
};

export default OrderedList;
