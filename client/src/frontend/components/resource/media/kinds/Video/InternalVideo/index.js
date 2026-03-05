import { lazy, Suspense } from "react";
import PropTypes from "prop-types";

const LoadablePlayer = lazy(() => import("../../shared/DefaultPlayer"));

function urlToRelativePath(url) {
  const trackUrl = new URL(url);
  return trackUrl.pathname;
}

function ResourceMediaVideoInternal({ resource }) {
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
    <Suspense fallback={null}>
      <LoadablePlayer
        title={title}
        src={src}
        poster={poster}
        tracks={tracks}
        download={download}
        viewType="video"
      />
    </Suspense>
  );
}

ResourceMediaVideoInternal.displayName = "Resource.Media.Video.Internal";

ResourceMediaVideoInternal.propTypes = {
  resource: PropTypes.object.isRequired
};

export default ResourceMediaVideoInternal;
