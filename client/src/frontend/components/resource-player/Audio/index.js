import PropTypes from "prop-types";
import loadable from "@loadable/component";

const LoadablePlayer = loadable(() => import("../shared/DefaultPlayer"));

function urlToRelativePath(url) {
  const trackUrl = new URL(url);
  return trackUrl.pathname;
}

export default function ResourcePlayerAudio({ resource }) {
  const { attachmentStyles, title, allowDownload } = resource.attributes;

  const src = attachmentStyles.original;

  if (!src) return null;

  const tracks =
    resource.relationships?.textTracks?.map(track => {
      const {
        id,
        attributes: { kind, srclang, cuesUrl, label }
      } = track;
      return {
        id,
        src: urlToRelativePath(cuesUrl),
        kind: kind,
        label: label,
        lang: srclang
      };
    }) ?? [];

  return (
    <LoadablePlayer
      title={title}
      src={src}
      tracks={tracks}
      download={
        allowDownload ? urlToRelativePath(attachmentStyles.original) : false
      }
      viewType="audio"
    />
  );
}

ResourcePlayerAudio.displayName = "Resource.Player.Audio";

ResourcePlayerAudio.propTypes = {
  resource: PropTypes.object
};
