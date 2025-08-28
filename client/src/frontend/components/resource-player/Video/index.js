import PropTypes from "prop-types";
import loadable from "@loadable/component";

const LoadablePlayer = loadable(() => import("../shared/DefaultPlayer"));

function urlToRelativePath(url) {
  const trackUrl = new URL(url);
  return trackUrl.pathname;
}

export default function ResourcePlayerVideo({ resource }) {
  const {
    variantPosterStyles,
    variantThumbnailStyles,
    attachmentStyles,
    title,
    allowDownload
  } = resource.attributes;

  const src = attachmentStyles.original;

  if (!src) return null;

  const poster =
    variantPosterStyles.mediumLandscape ??
    variantThumbnailStyles.mediumLandscape;

  const tracks =
    resource.relationships?.textTracks
      ?.map(track => {
        if (!track?.attributes) return null;

        const {
          id,
          attributes: { kind, srclang: lang, cuesUrl, label }
        } = track;

        return {
          id,
          src: urlToRelativePath(cuesUrl),
          kind,
          label,
          lang,
          default: kind === "chapters"
        };
      })
      .filter(Boolean) ?? [];

  const download = allowDownload
    ? urlToRelativePath(attachmentStyles.original)
    : false;

  return (
    <LoadablePlayer
      title={title}
      src={src}
      poster={poster}
      tracks={tracks}
      download={download}
      viewType="video"
    />
  );
}

ResourcePlayerVideo.displayName = "Resource.Player.Video";

ResourcePlayerVideo.propTypes = {
  resource: PropTypes.object,
  dispatch: PropTypes.func,
  t: PropTypes.func
};
