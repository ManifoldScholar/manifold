import PropTypes from "prop-types";
import PlaceholderGraphic from "components/frontend/resource/media/kinds/shared/PlaceholderGraphic";
import * as MediaStyles from "components/frontend/resource/media/styles";
import * as DefaultKindStyles from "components/frontend/resource/media/kinds/Default/styles";

export default function SlidePlaceholder({ aspectRatio, roundedCorners }) {
  return (
    <MediaStyles.Wrapper
      $aspectRatio={aspectRatio}
      $roundedCorners={roundedCorners}
    >
      <DefaultKindStyles.Wrapper>
        <PlaceholderGraphic isCollection />
      </DefaultKindStyles.Wrapper>
    </MediaStyles.Wrapper>
  );
}

SlidePlaceholder.displayName = "ResourceSlideshow.SlidePlaceholder";

SlidePlaceholder.propTypes = {
  aspectRatio: PropTypes.string,
  roundedCorners: PropTypes.bool
};
