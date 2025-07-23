import PropTypes from "prop-types";
import loadable from "@loadable/component";
import ThumbnailImage from "../shared/ThumbnailImage";
import PlaceholderGraphic from "../shared/PlaceholderGraphic";
import * as Styled from "./styles";

const LoadablePlayer = loadable(() => import("../shared/DefaultPlayer"));

function urlToRelativePath(url) {
  const trackUrl = new URL(url);
  return trackUrl.pathname;
}

function ResourcePlayerAudio({ resource }) {
  const {
    attachmentStyles,
    title,
    allowDownload,
    variantThumbnailStyles,
    variantThumbnailAltText
  } = resource.attributes;

  const src = attachmentStyles.original;

  if (!src) return null;

  const tracks =
    resource.relationships?.textTracks
      ?.map(track => {
        if (!track.attributes) return null;
        const { kind, srclang: lang, cuesUrl, label } = track.attributes;
        return {
          id: track.id,
          src: urlToRelativePath(cuesUrl),
          kind,
          label,
          lang,
          default: kind === "chapters"
        };
      })
      .filter(Boolean) ?? [];

  const imageSrc = variantThumbnailStyles?.largeLandscape;

  return (
    <Styled.Wrapper>
      {imageSrc ? (
        <ThumbnailImage src={imageSrc} alt={variantThumbnailAltText} />
      ) : (
        <PlaceholderGraphic resource={resource} />
      )}
      <Styled.PlayerWrapper>
        <LoadablePlayer
          title={title}
          src={src}
          tracks={tracks}
          download={
            allowDownload ? urlToRelativePath(attachmentStyles.original) : false
          }
          viewType="audio"
        />
      </Styled.PlayerWrapper>
    </Styled.Wrapper>
  );
}

ResourcePlayerAudio.displayName = "Resource.Player.Audio";

ResourcePlayerAudio.propTypes = {
  resource: PropTypes.object.isRequired
};

export default ResourcePlayerAudio;
