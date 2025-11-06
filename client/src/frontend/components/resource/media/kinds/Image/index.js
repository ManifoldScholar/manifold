import PropTypes from "prop-types";
import * as Styled from "./styles";

const ATTACHMENT_STYLE = "medium";

function ResourceMediaImage({ resource, fixedAspectRatio }) {
  const {
    attachmentAltText,
    attachmentStyles,
    attachmentMeta
  } = resource.attributes;
  const src = attachmentStyles[ATTACHMENT_STYLE];
  const { width, height } = attachmentMeta[ATTACHMENT_STYLE];

  return (
    <Styled.Image
      src={src}
      width={width}
      height={height}
      alt={attachmentAltText || ""}
      loading="lazy"
      $fixedAspectRatio={fixedAspectRatio}
    />
  );
}

ResourceMediaImage.displayName = "Resource.Media.Image";

ResourceMediaImage.propTypes = {
  resource: PropTypes.object.isRequired,
  fixedAspectRatio: PropTypes.bool
};

export default ResourceMediaImage;
