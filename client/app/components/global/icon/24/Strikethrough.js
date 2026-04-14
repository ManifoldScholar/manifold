import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function Strikethrough(props) {
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
      <path d="M21.5 13.3754H15.2225C14.945 13.3008 14.6662 13.231 14.3863 13.166C12.6312 12.751 11.6388 12.4473 11.6388 11.0266C11.6245 10.7814 11.6608 10.5358 11.7454 10.3052C11.83 10.0746 11.9612 9.86384 12.1306 9.68601C12.6615 9.24944 13.3264 9.00889 14.0137 9.00476C15.7825 8.96101 16.5981 9.56101 17.265 10.4735L18.2744 9.73601C17.8019 9.05748 17.1578 8.51654 16.4078 8.16845C15.6578 7.82036 14.8288 7.6776 14.0056 7.75476C12.9944 7.76121 12.0189 8.12947 11.2556 8.79288C10.9663 9.08632 10.7402 9.4359 10.5913 9.82008C10.4423 10.2043 10.3736 10.6149 10.3894 11.0266C10.362 11.4772 10.4466 11.9275 10.6357 12.3374C10.8248 12.7472 11.1125 13.1039 11.4731 13.3754H6.5V14.6254H15.0325C16.2619 14.9816 16.9969 15.4454 17.0156 16.7241C17.0359 16.9973 16.9985 17.2717 16.9056 17.5294C16.8128 17.7871 16.6667 18.0223 16.4769 18.2198C15.8155 18.7411 14.9938 19.017 14.1519 19.0004C13.5234 18.9822 12.9074 18.8213 12.3503 18.5299C11.7932 18.2385 11.3097 17.8243 10.9362 17.3185L9.97812 18.121C10.4636 18.768 11.0899 19.2959 11.8097 19.6648C12.5295 20.0338 13.3238 20.234 14.1325 20.2504H14.195C15.3492 20.2636 16.4695 19.86 17.35 19.1135C17.6625 18.7984 17.9054 18.4213 18.0632 18.0065C18.2209 17.5917 18.2898 17.1485 18.2656 16.7054C18.289 15.9474 18.0332 15.2072 17.5469 14.6254H21.5V13.3754Z" />
    </svg>
  );
}

Strikethrough.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stroke: PropTypes.string,
  fill: PropTypes.string,
  svgProps: PropTypes.object
};

export default Strikethrough;
