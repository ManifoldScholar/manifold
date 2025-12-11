import PropTypes from "prop-types";
import Zoom from "../Zoom";
import * as Kinds from "./kinds";
import getKindComponent from "./getKindComponent";
import * as Styled from "./styles";

function ResourceMediaFactory({
  resource,
  loading = false,
  aspectRatio,
  roundedCorners,
  enableZoom: enableZoomProp = false
}) {
  if (loading)
    return (
      <Kinds.Default
        resource={resource}
        fixedAspectRatio={!!aspectRatio}
        loading={loading}
      />
    );

  const KindComponent = getKindComponent(resource.attributes.kind);

  if (!KindComponent) return null;

  /* Don't zoom on low-res pdf thumbnails */
  const enableZoom =
    resource.attributes.kind === "pdf"
      ? !!resource.attributes.variantThumbnailStyles?.largeLandscape
      : enableZoomProp;

  return (
    <Styled.Wrapper $aspectRatio={aspectRatio} $roundedCorners={roundedCorners}>
      {enableZoom && <Zoom resource={resource} />}
      <KindComponent resource={resource} fixedAspectRatio={!!aspectRatio} />
    </Styled.Wrapper>
  );
}

ResourceMediaFactory.displayName = "Resource.Factory";

ResourceMediaFactory.propTypes = {
  resource: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  aspectRatio: PropTypes.string,
  roundedCorners: PropTypes.bool,
  enableZoom: PropTypes.bool
};

export default ResourceMediaFactory;
