import React from "react";
import PropTypes from "prop-types";
import Image from "../Image";
import classNames from "classnames";

const ResponsiveImage = ({ image, ratio = "5:8", className, title }) => {
  const paddingArray = ratio.split(":");
  const padding =
    paddingArray.length > 1
      ? (paddingArray[1] / paddingArray[0]) * 100 + "%"
      : "100%";

  return (
    <div
      padding={padding}
      className={classNames("responsive-image", className)}
    >
      <Image image={image} title={title} />
    </div>
  );
};

ResponsiveImage.propTypes = {
  className: PropTypes.string,
  image: PropTypes.object,
  ratio: PropTypes.string,
  title: PropTypes.string
};

export default ResponsiveImage;
