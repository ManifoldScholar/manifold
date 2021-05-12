const getSrcSet = (attrs, sizeKey, urlKey, sizes, orientation) => {
  const image = { renditions: [] };
  sizes.forEach(size => {
    const key =
      size.toLowerCase() +
      (orientation.trim()[0].toUpperCase() +
        orientation
          .trim()
          .slice(1)
          .toLowerCase());
    image.renditions.push({
      width: attrs[sizeKey][key],
      distributionUrl: attrs[urlKey][key]
    });
  });
  return image;
};

export { getSrcSet };
