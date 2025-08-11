import PropTypes from "prop-types";
import * as Styled from "./styles";

function ResourceMediaImage({ resource, fixedAspectRatio }) {
  const { altText, attachmentStyles } = resource.attributes;

  // TODO get dimensions from API
  return (
    <Styled.Image
      src={attachmentStyles.medium}
      alt={altText || ""}
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
