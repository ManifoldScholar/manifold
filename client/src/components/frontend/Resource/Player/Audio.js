import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";
import uniqueId from "lodash/uniqueId";

export default class ResourcePlayerAudio extends Component {
  static propTypes = {
    resource: PropTypes.object
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
      volume: 100
    };
  }

  componentDidMount() {
    // https://github.com/katspaugh/wavesurfer.js/issues/1334
    this.progressBarId = uniqueId("progress-bar-");
    this.volumeBarId = uniqueId("volume-bar-");
    this.WaveSurfer = require("wavesurfer"); // eslint-disable-line global-require
    this.throttleUpdateTime = throttle(this.updateTime, 900);
    this.debouncedResize = debounce(this.resizeWaveform, 120);
    window.addEventListener("resize", this.debouncedResize);

    this.initializeWaveform(this.props.resource);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.debouncedResize);
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

    this.audio = this.WaveSurfer.create({
      container: this.container,
      height: 275,
      waveColor: "#555", // $neutral80
      progressColor: "#52e3ac", // $accentPrimary
      barWidth: 5,
      barHeight: 1,
      cursorWidth: 0
    });
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
    const current = event.target.value / 100 * this.state.duration;
    const progress = current / this.state.duration;
    this.audio.seekTo(progress);
  };

  updateProgress = progress => {
    const percent = progress * 100;
    this.setState({ percent });
  };

  updateTime = () => {
    this.setState({
      currentTime: this.calcTime(this.audio.getCurrentTime())
    });
  };

  startPlayback = event => {
    event.preventDefault();
    if (!this.state.ready) return null;
    this.setState({ started: true, playing: true }, () => this.audio.play());
  };

  renderUnstarted() {
    if (this.state.started) return null;
    return (
      <div className="cover" onClick={this.startPlayback} role="button">
        <span className="screen-reader-text">Start Playback</span>
        <div className="play-button-indicator">
          <i
            className="manicon manicon-triangle-right-fill"
            aria-hidden="true"
          />
        </div>
      </div>
    );
  }

  render() {
    const playPauseClasses = classnames({
      manicon: true,
      "manicon-triangle-right-fill": !this.state.playing,
      "manicon-bars-parallel": this.state.playing
    });

    const muteClasses = classnames({
      manicon: true,
      "manicon-speaker": this.state.muted,
      "manicon-speaker-with-sound": !this.state.muted
    });

    const volume = this.state.muted ? 0 : this.state.volume;

    return (
      <div className="audio-player">
        {this.renderUnstarted()}
        <div
          className="waveform"
          ref={container => (this.container = container)}
        />
        <div className="control-bar">
          <button className="play-pause" onClick={this.togglePlayback}>
            <span className="screen-reader-text">
              {this.state.playing ? "Pause Playback" : "Start Playback"}
            </span>
            <i className={playPauseClasses} aria-hidden="true" />
          </button>
          <div className="progress">
            <div className="time">{this.state.currentTime}</div>
            <div className="slider">
              <div
                className="input-thumb"
                style={{
                  left: `calc(${this.state.percent}% - 10px)`
                }}
              />
              <label
                htmlFor={this.progressBarId}
                className="screen-reader-text"
              >
                Progress Bar
              </label>
              <input
                id={this.progressBarId}
                type="range"
                min="0"
                max="100"
                value={this.state.percent}
                onChange={this.handleProgressClick}
              />
            </div>
            <div className="time duration">{this.state.durationFormatted}</div>
          </div>
          <div className="volume">
            <button className="mute" onClick={this.toggleMute}>
              <span className="screen-reader-text">
                {this.state.muted ? "Unmute" : "Mute"}
              </span>
              <i className={muteClasses} aria-hidden="true" />
            </button>
            <div className="slider">
              <div
                className="input-thumb"
                style={{
                  left: `${volume * 0.7 - 10}px`
                }}
              />
              <label htmlFor={this.volumeBarId} className="screen-reader-text">
                Adjust Volume
              </label>
              <input
                id={this.volumeBarId}
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={this.setVolume}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
