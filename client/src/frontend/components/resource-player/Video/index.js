import { useMemo } from "react";
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
    externalType,
    externalId,
    allowDownload,
    subKind
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

  if (!src) return null;

  const poster =
    variantPosterStyles.mediumLandscape ??
    variantThumbnailStyles.mediumLandscape;

  const tracks =
    // shouldn't happen but just in case tracks get set on an external video
    subKind === "external_video"
      ? []
      : resource.relationships?.textTracks?.map(track => {
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
        }) ?? [];

  const download =
    allowDownload && subKind !== "external_video"
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
