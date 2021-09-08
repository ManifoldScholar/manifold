import React from "react";
import PropTypes from "prop-types";
import Resourceish from "frontend/components/resourceish";
import ResourcePreview from "frontend/components/resource-preview";
import Text from "./Text";

function Preview({ resource, detailUrl }) {
  const attr = resource.attributes;
  const previewable = ResourcePreview.canPreview(resource);
  const linkable = attr.kind.toLowerCase() === "link";
  const downloadable = attr.downloadable;

  const PreviewInner = () => (
    <div className="resource-card__preview-inner">
      <Resourceish.Thumbnail resourceish={resource} />
      <div className="resource-card__preview-text">
        <Text resource={resource} />
      </div>
    </div>
  );

  if (previewable)
    return (
      <ResourcePreview resource={resource}>
        <PreviewInner />
      </ResourcePreview>
    );

  if (linkable)
    return (
      <a
        href={attr.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="resource-card__preview-link"
      >
        <PreviewInner />
      </a>
    );

  if (downloadable)
    return (
      <a
        href={attr.attachmentStyles.original}
        download={attr.slug}
        className="resource-card__preview-link"
      >
        <PreviewInner />
      </a>
    );

  return (
    <a href={detailUrl} tabIndex={-1} className="resource-card__preview-link">
      <PreviewInner />
    </a>
  );
}

Preview.displayName = "ResourceCard.Preview";

Preview.propTypes = {
  resource: PropTypes.object.isRequired,
  detailUrl: PropTypes.string
};

export default Preview;
