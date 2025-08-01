import React, { useMemo } from "react";
import PropTypes from "prop-types";
import DefaultPlayer from "../shared/DefaultPlayer";

export default function ResourcePlayerVideo({ resource }) {
  const {
    // variantPosterStyles,
    variantThumbnailStyles,
    attachmentStyles,
    transcriptUrl,
    title,
    externalType,
    externalId
  } = resource.attributes;

  const src = useMemo(() => {
    switch (externalType) {
      case "vimeo":
        return `vimeo/${externalId}`;
      case "youtube":
        return `youtube/${externalId}`;
      default:
        return attachmentStyles.original;
    }
  }, [attachmentStyles, externalType, externalId]);

  // vidstack auto detects external poster urls
  const poster =
    externalType === null ? variantThumbnailStyles.mediumLandscape : null;

  const tracks = transcriptUrl
    ? [
        {
          src: transcriptUrl,
          label: "English",
          language: "en-US",
          kind: "subtitles",
          default: true
        }
      ]
    : null;

  return src ? (
    <DefaultPlayer
      title={title}
      src={src}
      poster={poster}
      tracks={tracks}
      viewType="video"
    />
  ) : null;
}

ResourcePlayerVideo.displayName = "Resource.Player.Video";

ResourcePlayerVideo.propTypes = {
  resource: PropTypes.object,
  dispatch: PropTypes.func,
  t: PropTypes.func
};
