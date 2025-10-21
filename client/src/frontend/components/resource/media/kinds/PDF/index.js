import PropTypes from "prop-types";
import * as Styled from "./styles";

function ResourceMediaPDF({ resource, fixedAspectRatio }) {
  const {
    altText,
    attachmentStyles,
    variantThumbnailStyles,
    variantThumbnailAltText
  } = resource.attributes;
  const imgProps = variantThumbnailStyles?.largeLandscape
    ? {
        src: variantThumbnailStyles.largeLandscape,
        alt: variantThumbnailAltText
      }
    : { src: attachmentStyles?.largeLandscape, alt: altText || "" };

  // TODO get dimensions from API
  return (
    <Styled.Image
      {...imgProps}
      loading="lazy"
      $fixedAspectRatio={fixedAspectRatio}
    />
  );
}

ResourceMediaPDF.displayName = "Resource.Media.PDF";

ResourceMediaPDF.propTypes = {
  resource: PropTypes.object.isRequired,
  fixedAspectRatio: PropTypes.bool
};

export default ResourceMediaPDF;
