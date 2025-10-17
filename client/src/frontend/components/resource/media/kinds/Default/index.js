import PropTypes from "prop-types";
import ThumbnailImage from "../shared/ThumbnailImage";
import PlaceholderGraphic from "../shared/PlaceholderGraphic";
import * as Styled from "./styles";

function ResourceMediaDefault({ resource, loading }) {
  const { variantThumbnailStyles } = resource?.attributes ?? {};
  const src = variantThumbnailStyles?.largeLandscape;

  return (
    <Styled.Wrapper>
      {src ? (
        <ThumbnailImage src={src} />
      ) : (
        <PlaceholderGraphic resource={resource} loading={loading} />
      )}
    </Styled.Wrapper>
  );
}

ResourceMediaDefault.displayName = "Resource.Media.Default";

ResourceMediaDefault.propTypes = {
  resource: PropTypes.object.isRequired,
  fixedAspectRatio: PropTypes.bool
};

export default ResourceMediaDefault;
