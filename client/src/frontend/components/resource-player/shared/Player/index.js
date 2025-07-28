import React, { forwardRef } from "react";
import { MediaProvider, Track, Poster } from "@vidstack/react";
import * as Styled from "./styles";

function MediaPlayer(
  { title, src, tracks, children, poster, playbackRate, ...rest },
  ref
) {
  if (!src) return null;

  return (
    <Styled.MediaPlayer
      className={`media-player dark`}
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
      {children}
    </Styled.MediaPlayer>
  );
}

export default forwardRef(MediaPlayer);
