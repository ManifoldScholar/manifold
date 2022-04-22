import React, { Component } from "react";
import PropTypes from "prop-types";
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";
import { UIDConsumer } from "react-uid";
import { withTranslation, Trans } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

class ResourcePlayerAudio extends Component {
  static displayName = "Resource.Player.Audio";

  static propTypes = {
    resource: PropTypes.object,
    t: PropTypes.func
  };

  constructor() {
    super();
    this.state = {
      started: false,
      ready: false,
      currentTime: "0:00",
      percent: 0,
      duration: null,
      durationFormatted: null,
      playing: false,
      muted: false,
      error: false,
      volume: 100
    };
  }

  componentDidMount() {
    // https://github.com/katspaugh/wavesurfer.js/issues/1334
    this.WaveSurfer = require("wavesurfer"); // eslint-disable-line global-require
    this.throttleUpdateTime = throttle(this.updateTime, 900);
    this.debouncedResize = debounce(this.resizeWaveform, 120);
    window.addEventListener("resize", this.debouncedResize);
    this.initializeWaveform(this.props.resource);
  }

  componentWillUnmount() {
    this.audio.pause();
    this.audio.destroy();
    this.audio = null;
    window.removeEventListener("resize", this.debouncedResize);
  }

  get progressBarIdPrefix() {
    return "progress-bar";
  }

  get volumeBarIdPrefix() {
    return "volume-bar";
  }

  get progressColor() {
    return getComputedStyle(document.body).getPropertyValue(
      "--color-accent-primary"
    );
  }

  setVolume = event => {
    event.preventDefault();
    const volume = parseInt(event.target.value, 10);
    this.setState({ volume, muted: false }, () => {
      this.audio.setMute(false);
      this.audio.setVolume(volume / 100);
    });
  };

  setReady = () => {
    const duration = this.audio.getDuration();
    this.setState({
      duration,
      durationFormatted: this.calcTime(duration),
      ready: true
    });
  };

  togglePlayback = event => {
    event.preventDefault();
    this.setState({ playing: !this.audio.isPlaying() }, () =>
      this.audio.playPause()
    );
  };

  toggleMute = event => {
    event.preventDefault();
    const muted = !this.audio.getMute();
    this.setState({ muted }, () => this.audio.toggleMute());
  };

  resizeWaveform = () => {
    this.audio.drawBuffer();
  };

  initializeWaveform(resource) {
    if (!this.WaveSurfer || !resource) return null;

    const WebAudioApi =
      window.AudioContext ||
      window.webkitAudioContext ||
      window.mozAudioContext ||
      window.oAudioContext ||
      window.msAudioContext;

    if (WebAudioApi) {
      this.audio = this.WaveSurfer.create({
        container: this.container,
        height: 275,
        waveColor: "#555", // $neutral80
        progressColor: this.progressColor,
        barWidth: 5,
        barHeight: 1,
        cursorWidth: 0
      });
    }

    this.audio.on("error", this.handleError);
    this.audio.on("ready", this.setReady);
    this.audio.on("seek", progress => this.handleSeek(progress));
    this.audio.on("audioprocess", currentTime =>
      this.handlePlayback(currentTime)
    );

    this.audio.load(resource.attributes.attachmentStyles.original);
  }

  calcTime = time => {
    const min = Math.floor(time / 60);
    let sec = Math.round(time - min * 60);
    if (sec < 10) sec = `0${sec}`;
    return `${min}:${sec}`;
  };

  handlePlayback = currentTime => {
    const progress = currentTime / this.state.duration;
    this.updateProgress(progress);
    this.throttleUpdateTime();
  };

  handleSeek = progress => {
    this.updateProgress(progress);
    this.updateTime();
  };

  handleProgressClick = event => {
    const current = (event.target.value / 100) * this.state.duration;
    const progress = current / this.state.duration;
    this.audio.seekTo(progress);
  };

  handleError = error => {
    const message = (
      <Trans i18nKey="errors.audio_playback" values={{ error }} />
    );
    this.setState({ error: message });
  };

  updateProgress = progress => {
    const percent = progress * 100;
    this.setState({ percent });
  };

  updateTime = () => {
    if (!this.audio) return null;

    this.setState({
      currentTime: this.calcTime(this.audio.getCurrentTime())
    });
  };

  startPlayback = event => {
    event.preventDefault();
    if (!this.state.ready) return null;
    this.setState({ started: true, playing: true }, () => this.audio.play());
  };

  renderError() {
    if (!this.state.error) return null;

    return (
      <Styled.Player>
        <Styled.Cover $isError>
          <Styled.Indicator>
            <IconComposer icon="stopSign64" size={56.615} />
          </Styled.Indicator>
          <Styled.ErrorMessage
            dangerouslySetInnerHTML={{ __html: this.state.error }}
          />
        </Styled.Cover>
      </Styled.Player>
    );
  }

  renderUnstarted() {
    if (this.state.started) return null;

    return (
      <Styled.Cover onClick={this.startPlayback} role="button" tabIndex="0">
        <span className="screen-reader-text">
          {this.props.t("actions.start_playback")}
        </span>
        <Styled.Indicator $absoluteCenter>
          <IconComposer icon="playSolid24" size={42.667} />
        </Styled.Indicator>
      </Styled.Cover>
    );
  }

  render() {
    const playPauseIcon = this.state.playing ? "pauseSolid24" : "playSolid24";
    const muteIcon = this.state.muted ? "speakerMuted24" : "speaker24";

    const volume = this.state.muted ? 0 : this.state.volume;

    const t = this.props.t;

    if (this.state.error) return this.renderError();

    return (
      <Styled.Player>
        {this.renderUnstarted()}
        <Styled.WaveForm ref={container => (this.container = container)} />
        <Styled.ControlBar>
          <button onClick={this.togglePlayback}>
            <span className="screen-reader-text">
              {this.state.playing
                ? t("actions.pause_playback")
                : t("actions.start_playback")}
            </span>
            <Styled.PlayPauseIcon icon={playPauseIcon} size={19.2} />
          </button>
          <Styled.Progress>
            <Styled.Time>{this.state.currentTime}</Styled.Time>
            <Styled.Slider>
              <Styled.ThumbInput
                style={{
                  left: `calc(${this.state.percent}% - 10px)`
                }}
              />
              <UIDConsumer name={id => `${this.progressBarIdPrefix}-${id}`}>
                {id => (
                  <>
                    <label htmlFor={id} className="screen-reader-text">
                      {t("glossary.progress_bar")}
                    </label>
                    <Styled.RangeInput
                      id={id}
                      type="range"
                      min="0"
                      max="100"
                      value={this.state.percent}
                      onChange={this.handleProgressClick}
                    />
                  </>
                )}
              </UIDConsumer>
            </Styled.Slider>
            <Styled.Time>{this.state.durationFormatted}</Styled.Time>
          </Styled.Progress>
          <Styled.Volume>
            <Styled.Mute onClick={this.toggleMute}>
              <span className="screen-reader-text">
                {this.state.muted ? t("actions.unmute") : t("actions.mute")}
              </span>
              <Styled.MuteIcon icon={muteIcon} size={21.333} />
            </Styled.Mute>
            <Styled.Slider>
              <Styled.ThumbInput
                style={{
                  left: `${volume * 0.7 - 10}px`
                }}
              />
              <UIDConsumer name={id => `${this.volumeBarIdPrefix}-${id}`}>
                {id => (
                  <>
                    <label htmlFor={id} className="screen-reader-text">
                      {t("actions.adjust_volume")}
                    </label>
                    <Styled.RangeInput
                      id={id}
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={this.setVolume}
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
}

export default withTranslation()(ResourcePlayerAudio);
