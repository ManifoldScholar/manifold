import PropTypes from "prop-types";
import ExternalVideo from "./ExternalVideo";
import InternalVideo from "./InternalVideo";

function ResourceMediaVideo({ resource, active }) {
  const VideoComponent =
    resource.attributes.subKind === "external_video"
      ? ExternalVideo
      : InternalVideo;

  return <VideoComponent resource={resource} active={active} />;
}

ResourceMediaVideo.displayName = "Resource.Media.Video";

ResourceMediaVideo.propTypes = {
  resource: PropTypes.object.isRequired
};

export default ResourceMediaVideo;
