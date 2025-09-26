import PropTypes from "prop-types";
import Zoom from "../Zoom";
import * as Kinds from "./kinds";
import * as Styled from "./styles";

function getKindComponent(kind) {
  switch (kind) {
    case "audio":
      return Kinds.Audio;
    case "image":
      return Kinds.Image;
    case "interactive":
      return Kinds.Interactive;
    case "video":
      return Kinds.Video;
    default:
      return Kinds.Default;
  }
}

function ResourceMediaFactory({
  resource,
  loading = false,
  aspectRatio,
  roundedCorners,
  enableZoom = false
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
