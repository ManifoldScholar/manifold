export default `
  /* Library defaults with some overrides by CIC */

  .rh5v-DefaultPlayer_component {
    /* CIC override default sizing */
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .rh5v-DefaultPlayer_video {
    width: 100%;
    height: 100%;
  }

  .rh5v-DefaultPlayer_controls {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    height: 34px;
    background-color: rgba(0, 0, 0, 0.7);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .rh5v-DefaultPlayer_seek {
    flex-grow: 1;
  }

  .rh5v-DefaultPlayer_component:hover .rh5v-DefaultPlayer_controls {
    opacity: 1;
  }

  .rh5v-Time_component {
    padding: 0 10px;
    line-height: 35px;
    color: #fff;
  }

  .rh5v-Time_current {
    margin-right: 5px;
  }

  .rh5v-Time_duration {
    margin-left: 5px;
    color: #919191;
  }

  .rh5v-Seek_component {
    position: relative;
  }

  .rh5v-Seek_track {
    position: absolute;
    top: 50%;
    right: 5px;
    left: 5px;
    height: 4px;
    background-color: #3e3e3e;
    transform: translateY(-50%);
  }

  .rh5v-Seek_buffer,
  .rh5v-Seek_fill,
  .rh5v-Seek_input {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
  }

  .rh5v-Seek_buffer {
    background-color: #5a5a5a;
  }

  .rh5v-Seek_fill {
    background: #fff;
  }

  .rh5v-Seek_input {
    width: 100%;
    cursor: pointer;
    opacity: 0;
  }

  .rh5v-Volume_component {
    position: relative;
  }

  .rh5v-Volume_component:hover {
    background-color: #000;
  }

  .rh5v-Volume_button {
    width: 34px;
    height: 34px;
    padding: 0;
    overflow: visible;
    font: inherit;
    line-height: normal;
    color: inherit;
    cursor: pointer;
    background: none;
    border: 0;
  }

  .rh5v-Volume_icon {
    padding: 7px;
  }

  .rh5v-Volume_slider {
    position: absolute;
    right: 5px;
    bottom: 100%;
    left: 5px;
    display: none;
    height: 56px;
    background-color: #000;
  }

  .rh5v-Volume_component:hover .rh5v-Volume_slider {
    display: block;
  }

  .rh5v-Volume_track {
    position: absolute;
    top: 8px;
    bottom: 8px;
    left: 50%;
    width: 4px;
    background-color: #3e3e3e;
    transform: translateX(-50%);
  }

  .rh5v-Volume_fill,
  .rh5v-Volume_input {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .rh5v-Volume_fill {
    background-color: #fff;
  }

  .rh5v-Volume_input {
    padding: 0;
    margin: 0;
    cursor: pointer;
    opacity: 0;
    -webkit-appearance: slider-vertical;
  }

  .rh5v-Captions_component {
    position: relative;
  }

  .rh5v-Captions_component:hover {
    background-color: #000;
  }

  .rh5v-Captions_button {
    width: 34px;
    height: 34px;
    padding: 0;
    overflow: visible;
    font: inherit;
    line-height: normal;
    color: inherit;
    cursor: pointer;
    background: none;
    border: 0;
  }

  .rh5v-Captions_icon {
    padding: 5px;
  }

  .rh5v-Captions_trackList {
    position: absolute;
    right: 0;
    bottom: 100%;
    display: none;
    padding: 0;
    margin: 0;
    color: #fff;
    list-style: none;
    background-color: rgba(0, 0, 0, 0.7);
  }

  .rh5v-Captions_component:hover .rh5v-Captions_trackList {
    display: block;
  }

  .rh5v-Captions_trackItem {
    padding: 7px;
    cursor: pointer;
  }

  .rh5v-Captions_activeTrackItem,
  .rh5v-Captions_trackItem:hover {
    background: #000;
  }

  .rh5v-Captions_activeTrackItem {
    text-decoration-line: underline;
  }

  .rh5v-PlayPause_component {
  }

  .rh5v-PlayPause_component:hover {
    background-color: #000;
  }

  .rh5v-PlayPause_button {
    width: 34px;
    height: 34px;
    padding: 0;
    overflow: visible;
    font: inherit;
    line-height: normal;
    color: inherit;
    cursor: pointer;
    background: none;
    border: 0;
  }

  .rh5v-PlayPause_icon {
    padding: 5px;
  }

  .rh5v-Fullscreen_component {
  }

  .rh5v-Fullscreen_component:hover {
    background-color: #000;
  }

  .rh5v-Fullscreen_button {
    width: 34px;
    height: 34px;
    padding: 0;
    overflow: visible;
    font: inherit;
    line-height: normal;
    color: inherit;
    cursor: pointer;
    background: none;
    border: 0;
  }

  .rh5v-Fullscreen_icon {
    padding: 5px;
  }

  .rh5v-Overlay_component {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: #fff;
    text-align: center;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0);
  }

  .rh5v-Overlay_inner {
    position: absolute;
    top: 50%;
    right: 0;
    left: 50%;
    display: inline-block;
    width: 60px;
    height: 60px;
    margin-left: -30px;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 10px;
    transform: translateY(-50%);
  }

  .rh5v-Overlay_icon {
    position: absolute;
    top: 50%;
    right: 0;
    left: calc(50% - 40px);
    transform: translateY(-50%);
  }
`;
