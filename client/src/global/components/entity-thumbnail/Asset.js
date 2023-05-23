import React from "react";
import PropTypes from "prop-types";
import IconComputed from "global/components/icon-computed";

export default function EntityThumbnailAsset({
  entity,
  width,
  height,
  className,
  icon,
  isImage
}) {
  const { id } = entity ?? {};

  const src = `/api/proxy/ingestion_sources/${id}`;

  return isImage ? (
    <img
      alt=""
      src={src}
      width={width}
      height={height}
      className={className}
      loading="lazy"
    />
  ) : (
    <IconComputed.Resource
      svgProps={{ width, height }}
      icon={icon}
      className={className}
    />
  );
}

EntityThumbnailAsset.displayName = "EntityThumbnail.Asset";

EntityThumbnailAsset.propTypes = {
  entity: PropTypes.object.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.string.isRequired
};
