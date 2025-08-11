import PropTypes from "prop-types";
import * as Styled from "./styles";

function ResourceMediaThumbnailImage({ src }) {
  return (
    <Styled.Wrapper>
      <Styled.Image
        src={src}
        width={800}
        height={450}
        alt=""
        loading="lazy"
        decoding="async"
      />
    </Styled.Wrapper>
  );
}

ResourceMediaThumbnailImage.displayName = "Resource.Media.ThumbnailImage";

ResourceMediaThumbnailImage.propTypes = {
  src: PropTypes.string.isRequired,
  fixedAspectRatio: PropTypes.bool
};

export default ResourceMediaThumbnailImage;
