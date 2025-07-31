import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { MediaProvider, Track, Poster } from "@vidstack/react";
import * as Styled from "./styles";

function MediaPlayer({ title, src, tracks, children, poster, ...rest }, ref) {
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

MediaPlayer.propTypes = {
  title: PropTypes.string,
  src: PropTypes.string,
  tracks: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.node,
  poster: PropTypes.string
};
