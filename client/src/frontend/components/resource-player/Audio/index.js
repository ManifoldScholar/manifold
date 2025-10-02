import React from "react";
import PropTypes from "prop-types";
import DefaultPlayer from "../shared/DefaultPlayer";

export default function ResourcePlayerAudio({ resource }) {
  const player = React.useRef(null);

  const {
    // variantPosterStyles,
    attachmentStyles,
    transcriptUrl,
    title
  } = resource.attributes;

  const src = attachmentStyles.original;

  // const tracks = relationships?.textTracks;
  const tracks = [
    {
      src: transcriptUrl,
      label: "English",
      language: "en-US",
      kind: "subtitles",
      default: true
    }
  ];

  if (!src) return null;

  return <DefaultPlayer title={title} src={src} ref={player} tracks={tracks} />;
}

ResourcePlayerAudio.displayName = "Resource.Player.Audio";

ResourcePlayerAudio.propTypes = {
  resource: PropTypes.object
};
