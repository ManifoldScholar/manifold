import React from "react";
import PropTypes from "prop-types";

const position = (x, y) => {
  if (!x && !y) return null;
  return `${x || 50}% ${y || 50}%`;
};

const srcSetEntry = ({ distributionUrl, width }) =>
  `${distributionUrl} ${width}w`;

const getSizes = (renditions, maxWidth) => {
  const filteredRenditions = renditions.filter(
    rendition => rendition.width <= maxWidth
  );
  if (filteredRenditions.length < 1) {
    return "";
  }
  const largestUsableRendition =
    filteredRenditions[filteredRenditions.length - 1];
  let sizes = filteredRenditions
    .map(rendition => `(max-width: ${rendition.width}px) ${rendition.width}px`)
    .join(",");
  sizes = `${sizes},${largestUsableRendition.width}px`;
  return sizes;
};

const Image = ({ image, className, style, title, maxSize, ...props }) => {
  const {
    id,
    url,
    width,
    height,
    renditions = [],
    altText,
    focalPointX,
    focalPointY
  } = image;

  const fullStyle = {
    objectPosition: position(focalPointX, focalPointY),
    ...style
  };
  const sortedRenditions = renditions.sort((a, b) => a.width - b.width);
  const hasRenditions = sortedRenditions.length > 0;
  // Use the smallest image as the default src.
  const { distributionUrl: src = "" } = sortedRenditions[0] || {};

  const imageProperties = {
    className,
    height,
    width,
    src: src || url,
    srcSet: hasRenditions ? sortedRenditions.map(srcSetEntry).join(",") : null,
    "data-id": id,
    style: fullStyle,
    ...props
  };

  const max = maxSize || sortedRenditions[sortedRenditions.length - 1]?.width;
  if (renditions.length > 1) {
    imageProperties.sizes = getSizes(sortedRenditions, max);
  }

  return <img alt={altText || title} {...imageProperties} {...props} />;
};

Image.displayName = "Atomic.Image";

Image.propTypes = {
  image: PropTypes.object.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.string,
  maxSize: PropTypes.number
};

export default Image;
