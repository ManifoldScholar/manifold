import PropTypes from "prop-types";
import { MediaProvider, Poster, Track } from "@vidstack/react";
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout
} from "@vidstack/react/player/layouts/default";
import { Global as GlobalStyles } from "@emotion/react";
import vdsStyles from "./vdsStyles";
import * as Styled from "./styles";

function DefaultPlayer({ title, src, tracks, poster, viewType }) {
  if (!src) return null;

  return (
    <>
      <GlobalStyles styles={vdsStyles} />
      <Styled.MediaPlayer
        title={title}
        src={src}
        crossOrigin
        playsInline
        viewType={viewType || "video"}
        aspectRatio={viewType === "video" ? "16/9" : undefined}
        className="bg-neutral95"
      >
        <MediaProvider>
          {/* Automatically detects youtube & vimeo posters */}
          <Poster
            className={`vds-poster`}
            alt=""
            {...(poster ? { src: poster } : {})}
          />
          {tracks?.map(track => (
            <Track {...track} key={track.id} />
          ))}
        </MediaProvider>
        <DefaultAudioLayout icons={defaultLayoutIcons} colorScheme="dark" />
        <DefaultVideoLayout
          icons={defaultLayoutIcons}
          colorScheme="dark"
          slots={{
            googleCastButton: null,
            airPlayButton: null,
            playbackMenuLoop: null
          }}
          noAudioGain
        />
      </Styled.MediaPlayer>
    </>
  );
}

DefaultPlayer.propTypes = {
  title: PropTypes.string,
  src: PropTypes.string,
  tracks: PropTypes.arrayOf(PropTypes.object),
  poster: PropTypes.string,
  viewType: PropTypes.oneOf(["video", "audio"])
};

export default DefaultPlayer;
