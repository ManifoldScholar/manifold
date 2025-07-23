import PropTypes from "prop-types";
import ThumbnailImage from "frontend/components/resource/media/kinds/shared/ThumbnailImage";
import PlaceholderGraphic from "frontend/components/resource/media/kinds/shared/PlaceholderGraphic";
import * as Styled from "./styles";

function ResourceCollectionEmpty({ resourceCollection, loading }) {
  const { thumbnailStyles, thumbnailAltText } =
    resourceCollection?.attributes ?? {};
  const src = thumbnailStyles?.largeLandscape;

  return (
    <Styled.Wrapper>
      {src ? (
        <ThumbnailImage src={src} alt={thumbnailAltText} />
      ) : (
        <PlaceholderGraphic isCollection loading={loading} />
      )}
    </Styled.Wrapper>
  );
}

ResourceCollectionEmpty.displayName = "Resource.Collection.Empty";

ResourceCollectionEmpty.propTypes = {
  resourceCollection: PropTypes.object.isRequired,
  loading: PropTypes.bool
};

export default ResourceCollectionEmpty;
