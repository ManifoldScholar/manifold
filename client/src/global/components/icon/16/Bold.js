import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function Bold(props) {
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
        d="M12.2857 5.34402V5.17772C12.2857 3.42337 10.7125 2 8.77321 2H3.48929C3.21964 2 3 2.20054 3 2.44674V13.519C3 13.7848 3.23571 14 3.52679 14H9.21786C11.3071 14 13 12.4641 13 10.5679V10.3886C13 9.19837 12.3321 8.15 11.3179 7.5337C11.9179 6.96304 12.2857 6.19185 12.2857 5.34402ZM8.72679 3.56522C9.74643 3.56522 10.5714 4.28913 10.5714 5.18424V5.33913C10.5714 6.23261 9.74464 6.95815 8.72679 6.95815H4.71429V3.56522H8.72679ZM4.71429 12.4234H9.19821C10.3375 12.4234 11.2607 11.5918 11.2607 10.5663V10.3902C11.2607 9.36467 10.3375 8.53315 9.19821 8.53315H4.71429V12.4234Z"
      />
    </svg>
  );
}

Bold.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stroke: PropTypes.string,
  fill: PropTypes.string,
  svgProps: PropTypes.object
};

export default Bold;
