import { MediaProvider, Poster, Track } from "@vidstack/react";
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout
} from "@vidstack/react/player/layouts/default";
import { forwardRef } from "react";
import * as Styled from "./styles";

function DefaultPlayer({ title, src, tracks, children, poster, ...rest }, ref) {
  return (
    <Styled.MediaPlayer
      title={title}
      src={src}
      crossOrigin
      playsInline
      ref={ref}
      {...rest}
    >
      <MediaProvider>
        {!!poster && (
          <Poster className={`poster vds-poster`} src={poster} alt="" />
        )}
        {tracks?.map(track => (
          <Track {...track} key={track.src} />
        ))}
      </MediaProvider>
      <DefaultAudioLayout icons={defaultLayoutIcons} colorScheme="dark" />
      <DefaultVideoLayout icons={defaultLayoutIcons} colorScheme="dark" />
    </Styled.MediaPlayer>
  );
}

export default forwardRef(DefaultPlayer);
