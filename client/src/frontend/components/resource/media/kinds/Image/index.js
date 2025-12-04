import PropTypes from "prop-types";
import * as Styled from "./styles";

function ResourceMediaImage({ resource, fixedAspectRatio }) {
  const {
    attachmentAltText,
    attachmentStyles,
    attachmentMeta
  } = resource.attributes;
  const src = attachmentStyles.large ?? attachmentStyles.medium;
  const { width, height } = attachmentMeta.large ?? attachmentMeta.medium;

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
