import React from "react";
import PropTypes from "prop-types";
import Resourceish from "frontend/components/resourceish";
import ResourcePreview from "frontend/components/resource-preview";
import Text from "./Text";
import * as Styled from "./styles";

function Preview({ resource, detailUrl }) {
  const attr = resource.attributes;
  const previewable = ResourcePreview.canPreview(resource);
  const linkable = attr.kind.toLowerCase() === "link";
  const downloadable = attr.downloadable;

  const PreviewInner = () => (
    <Styled.Inner>
      <Resourceish.Thumbnail resourceish={resource} />
      <Styled.TextWrapper>
        <Text resource={resource} />
      </Styled.TextWrapper>
    </Styled.Inner>
  );

  if (previewable)
    return (
      <ResourcePreview resource={resource} toggleType="card">
        <PreviewInner />
      </ResourcePreview>
    );

  if (linkable)
    return (
      <Styled.Link
        href={attr.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <PreviewInner />
      </Styled.Link>
    );

  if (downloadable)
    return (
      <Styled.Link href={attr.attachmentStyles.original} download={attr.slug}>
        <PreviewInner />
      </Styled.Link>
    );

  return (
    <Styled.Link href={detailUrl} tabIndex={-1}>
      <PreviewInner />
    </Styled.Link>
  );
}

Preview.displayName = "ResourceCard.Preview";

Preview.propTypes = {
  resource: PropTypes.object.isRequired,
  detailUrl: PropTypes.string
};

export default Preview;
