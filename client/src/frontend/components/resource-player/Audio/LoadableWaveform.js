import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useWavesurfer } from "@wavesurfer/react";
import { UIDConsumer } from "react-uid";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

function formatDuration(time) {
  const min = Math.floor(time / 60);
  let sec = Math.round(time - min * 60);
  if (sec < 10) sec = `0${sec}`;
  return `${min}:${sec}`;
}

export default function LoadableWaveform({ resource }) {
  const { t } = useTranslation();

  const [isStarted, setStarted] = useState(false);
  const [isErrored, setIsErrored] = useState(false);

  const waveformRef = useRef(null);

  const { wavesurfer, isReady, isPlaying, currentTime } = useWavesurfer({
    container: waveformRef,
    url: resource.attributes.attachmentStyles.original,
    height: 275,
    waveColor: "#555", // $neutral80
    progressColor: getComputedStyle(document.body).getPropertyValue(
      "--color-accent-primary",
    ),
    barWidth: 5,
    barHeight: 1,
    cursorWidth: 0,
  });

  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.on("error", (error) => {
        console.error(error);
        setIsErrored(true);
      });
    }
  }, [wavesurfer]);

  const duration = wavesurfer?.getDuration();
  const formattedDuration = formatDuration(duration);
  const progress = !isNaN(currentTime / duration) ? currentTime / duration : 0;
  const volume = !isNaN(wavesurfer?.getVolume()) ? wavesurfer?.getVolume() : 1;
  const muted = wavesurfer?.getMuted();

  function startPlayback() {
    if (!isReady || !wavesurfer) return null;
    setStarted(true);
    wavesurfer.playPause();
  }

  function togglePlayback() {
    if (wavesurfer) {
      wavesurfer.playPause();
    }
  }

  function handleProgressClick(event) {
    const current = (event.target.value / 100) * duration;
    const updatedProgress = current / duration;
    if (wavesurfer) {
      wavesurfer.seekTo(updatedProgress);
    }
  }

  function toggleMute() {
    if (wavesurfer) {
      wavesurfer.setMuted(!muted);
    }
  }

  function setVolume(event) {
    if (wavesurfer) {
      const newVolume = parseInt(event.target.value, 10);
      wavesurfer.setMuted(false);
      wavesurfer.setVolume(newVolume / 100);
    }
  }

  if (isErrored) {
    return (
      <Styled.Player>
        <Styled.Cover $isError>
          <Styled.Indicator>
            <IconComposer icon="stopSign64" size={56.615} />
          </Styled.Indicator>
          <Styled.ErrorMessage
            dangerouslySetInnerHTML={{ __html: t("errors.audio_playback") }}
          />
        </Styled.Cover>
      </Styled.Player>
    );
  }

  return (
    <Styled.Player>
      {!isStarted && (
        <Styled.Cover onClick={startPlayback} role="button" tabIndex="0">
          <span className="screen-reader-text">
            {t("actions.start_playback")}
          </span>
          <Styled.Indicator $absoluteCenter>
            <IconComposer icon="playSolid24" size={42.667} />
          </Styled.Indicator>
        </Styled.Cover>
      )}
      <Styled.WaveForm ref={waveformRef} />
      <Styled.ControlBar>
        <button onClick={togglePlayback}>
          <span className="screen-reader-text">
            {isPlaying
              ? t("actions.pause_playback")
              : t("actions.start_playback")}
          </span>
          <Styled.PlayPauseIcon
            icon={isPlaying ? "pauseSolid24" : "playSolid24"}
            size={19.2}
          />
        </button>
        <Styled.Progress>
          <Styled.Time>{formatDuration(currentTime)}</Styled.Time>
          <Styled.Slider>
            <Styled.ThumbInput
              style={{
                insetInlineStart: `calc(${progress * 100}%)`,
              }}
            />
            <UIDConsumer name={(id) => `progress-bar-${id}`}>
              {(id) => (
                <>
                  <label htmlFor={id} className="screen-reader-text">
                    {t("glossary.progress_bar")}
                  </label>
                  <Styled.RangeInput
                    id={id}
                    type="range"
                    min="0"
                    max="100"
                    value={progress * 100}
                    onChange={handleProgressClick}
                  />
                </>
              )}
            </UIDConsumer>
          </Styled.Slider>
          <Styled.Time>{formattedDuration}</Styled.Time>
        </Styled.Progress>
        <Styled.Volume>
          <Styled.Mute onClick={toggleMute}>
            <span className="screen-reader-text">
              {muted ? t("actions.unmute") : t("actions.mute")}
            </span>
            <Styled.MuteIcon
              icon={muted ? "speakerMuted24" : "speaker24"}
              size={21.333}
            />
          </Styled.Mute>
          <Styled.Slider>
            <Styled.ThumbInput
              style={{
                insetInlineStart: `${volume * 70}px`,
              }}
            />
            <UIDConsumer name={(id) => `volume-bar-${id}`}>
              {(id) => (
                <>
                  <label htmlFor={id} className="screen-reader-text">
                    {t("actions.adjust_volume")}
                  </label>
                  <Styled.RangeInput
                    id={id}
                    type="range"
                    min="0"
                    max="100"
                    value={volume * 100}
                    onChange={setVolume}
                  />
                </>
              )}
            </UIDConsumer>
          </Styled.Slider>
        </Styled.Volume>
      </Styled.ControlBar>
    </Styled.Player>
  );
}

LoadableWaveform.propTypes = {
  resource: PropTypes.object,
};
