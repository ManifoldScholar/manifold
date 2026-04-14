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
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.75 16.9989H10V17.9989H3.75V16.9989Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.75 13.4989H10.75V14.4989H3.75V13.4989Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.75 9.99891H12.625V10.9989H3.75V9.99891Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.75 6.49891H14.875V7.49891H3.75V6.49891Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.9921 6.36525C18.6932 6.19267 18.311 6.29509 18.1384 6.59402L12.7766 15.881L12.9506 18.5795L15.3746 17.381L20.7364 8.09397C20.909 7.79503 20.8066 7.41279 20.5076 7.2402L18.9921 6.36525ZM17.2723 6.09402C17.7211 5.3168 18.7149 5.0505 19.4921 5.49922L21.0076 6.37417C21.7849 6.82289 22.0512 7.81673 21.6024 8.59396L16.0893 18.1432L12.0492 20.1408L11.7591 15.6432L17.2723 6.09402Z"
      />
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
