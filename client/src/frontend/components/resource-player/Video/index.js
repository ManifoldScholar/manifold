import React, { useMemo } from "react";
import PropTypes from "prop-types";
import VideoLayout from "./VideoLayout";
import Player from "../shared/Player";

export default function ResourcePlayerVideo({ resource }) {
  const player = React.useRef(null);

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

  // const poster = variantPosterStyles.mediumLandscape;
  const poster = variantThumbnailStyles.mediumLandscape;

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

  if (!src) return null;

  return (
    <Player
      title={title}
      src={src}
      ref={player}
      poster={poster}
      tracks={tracks}
    >
      <VideoLayout />
    </Player>
  );
}

ResourcePlayerVideo.displayName = "Resource.Player.Video";

ResourcePlayerVideo.propTypes = {
  resource: PropTypes.object,
  dispatch: PropTypes.func,
  t: PropTypes.func
};
