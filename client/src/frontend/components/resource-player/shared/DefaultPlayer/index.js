import { useRef } from "react";
import PropTypes from "prop-types";
import { MediaProvider, Poster, Track } from "@vidstack/react";
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout
} from "@vidstack/react/player/layouts/default";
import * as Styled from "./styles";

function DefaultPlayer({ title, src, tracks, poster, viewType }) {
  const ref = useRef();

  return src ? (
    <Styled.MediaPlayer
      title={title}
      src={src}
      crossOrigin
      playsInline
      viewType={viewType || "video"}
      ref={ref}
    >
      <MediaProvider>
        {/* Automatically detects youtube & vimeo posters */}
        <Poster
          className={`vds-poster`}
          alt=""
          {...(poster ? { src: poster } : {})}
        />
        {tracks?.map(track => (
          <Track {...track} key={track.src} />
        ))}
      </MediaProvider>
      <DefaultAudioLayout icons={defaultLayoutIcons} colorScheme="dark" />
      <DefaultVideoLayout icons={defaultLayoutIcons} colorScheme="dark" />
    </Styled.MediaPlayer>
  ) : null;
}

DefaultPlayer.propTypes = {
  title: PropTypes.string,
  src: PropTypes.string,
  tracks: PropTypes.arrayOf(PropTypes.object),
  poster: PropTypes.string,
  viewType: PropTypes.oneOf(["video", "audio"])
};

export default DefaultPlayer;
