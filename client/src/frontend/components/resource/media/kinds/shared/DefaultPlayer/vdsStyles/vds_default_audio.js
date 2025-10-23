/*
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Default VDS Audio Layout
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
export default `
[data-media-player] .vds-audio-layout:not([data-match]) {
  display: none !important;
}

:where([data-media-player][data-layout='audio']) {
  border-radius: var(--audio-border-radius, 6px);
}

:where(.vds-audio-layout) {
  position: relative;
  display: inline-flex;
  align-items: center;
  min-width: 100%;
  height: 60px;
  color: var(--audio-controls-color, var(--default-color));
  background-color: var(--audio-bg, var(--default-bg));
  border-radius: var(--audio-border-radius, 6px);
  box-sizing: border-box;
  filter: var(
    --audio-filter,
    drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))
  );
  font-family: var(--audio-font-family);

}

.vds-audio-layout {
  border: var(--audio-border, 1px solid rgb(255 255 255 / 0.1));
}

:where([data-media-player][data-focus]:not([data-playing]) .vds-audio-layout) {
  box-shadow: var(--media-focus-ring);
}

:where(.vds-audio-layout) {
  --media-brand: var(--audio-brand, var(--default-brand));
  --media-font-family: var(--audio-font-family, sans-serif);
  --media-controls-color: var(--audio-controls-color, var(--default-controls-color));
  --media-menu-y-offset: 18px;
  --media-tooltip-y-offset: 18px;
  --media-slider-track-bg: var(--audio-slider-track-bg, var(--default-slider-track-bg));
  --media-slider-track-fill-bg: var(--audio-slider-track-bg, var(--media-brand));
  --media-slider-track-progress-bg: var(
    --audio-slider-progress-bg,
    var(--default-slider-progress-bg)
  );
  --media-slider-value-border: var(--audio-slider-value-border, 1px solid rgb(255 255 255 / 0.1));
  --media-slider-value-gap: var(--audio-slider-value-gap, 6px);
  --media-focus-ring-color: var(--audio-focus-ring-color, rgb(78 156 246));
  --media-focus-ring: var(--audio-focus-ring, 0 0 0 3px var(--media-focus-ring-color));
}

.vds-audio-layout.light,
.light .vds-audio-layout {
  --default-brand: rgb(10 10 10);
  --default-color: rgb(10 10 10);
  --default-bg: rgb(250 250 250);
  --default-controls-color: rgb(10 10 10);
  --default-border: 1px solid rgb(100 100 100 /0.2);
  --default-slider-track-bg: rgb(50 50 50 / 0.1);
  --default-slider-progress-bg: rgb(10 10 10 / 0.2);
}

.vds-audio-layout.dark,
.dark .vds-audio-layout {
  --default-brand: #f5f5f5;
  --default-color: #f5f5f5;
  --default-controls-color: #f5f5f5;
  --default-bg: black;
  --default-slider-track-bg: rgb(255 255 255 / 0.3);
  --default-slider-progress-bg: rgb(255 255 255 / 0.5);
}

/*
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Controls
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

.vds-audio-layout .vds-controls {
  padding-inline: 12px;
  border-radius: var(--audio-border-radius, 6px);
}

:where(.vds-audio-layout .vds-controls-group) {
  display: flex;
  align-items: center;
  pointer-events: auto;
  width: 100%;
}

:where(.vds-audio-layout .vds-button) {
  width: var(--audio-button-size, 36px);
  height: var(--audio-button-size, 36px);
  margin-right: 2.5px;
}

/*
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Buttons
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

:where(.vds-audio-layout .vds-play-tooltip) {
  --media-tooltip-y-offset: 18px;
}

:where(.vds-audio-layout .vds-button) {
  transition: max-width 140ms ease-in;
  max-width: var(--audio-button-size, 36px);
}

:where(.vds-audio-layout .vds-play-button) {
  --media-button-hover-transform: 0;
  --media-button-border: var(--audio-play-button-border, var(--color));
  --media-button-hover-bg: var(--bg-color);
  --media-button-touch-hover-bg: var(--bg-color);
  width: var(--audio-play-button-size, 32px);
  height: var(--audio-play-button-size, 32px);
  border-radius: var(--audio-play-button-border-radius, 100%);
  pointer-events: auto;
  margin-bottom: 2px;
  overflow: hidden;
}

.vds-audio-layout .vds-play-button {
  color: var(--audio-play-button-color, var(--default-color));
  background-color: var(--audio-play-button-bg, var(--default-bg));
}

.light .vds-audio-layout .vds-play-button,
.vds-audio-layout.light .vds-play-button {
  --default-color: #f5f5f5;
  --default-bg: var(--media-brand);
}

.dark .vds-audio-layout .vds-play-button,
.vds-audio-layout.dark .vds-play-button {
  --default-color: rgb(10 10 10);
  --default-bg: var(--media-brand);
}

:where(.vds-audio-layout .vds-caption-button:not([data-active])) {
  opacity: var(--audio-caption-button-off-opacity, 0.64);
}

:where(.vds-audio-layout .vds-live-button) {
  margin-right: 8px;
}

:where(.vds-audio-layout .vds-seek-button) {
  max-width: 0px;
  visibility: hidden;
}

:where([data-playing] .vds-audio-layout .vds-seek-button) {
  max-width: var(--audio-button-size, 36px);
  visibility: visible;
}

:where(.vds-audio-layout .vds-settings-menu .vds-button) {
  margin-right: 0;
}

@media (pointer: coarse) {
  :where(.vds-audio-layout .vds-caption-button) {
    display: none;
  }
}

/*
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Title
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

:where(.vds-audio-layout .vds-title) {
  display: flex;
  align-items: center;
  position: relative;
  margin-left: 6px;
  margin-right: auto;
  max-width: 100%;
  opacity: 1;
  transition:
    max-width 150ms ease-in,
    opacity 150ms ease-in;
  overflow: hidden;
  text-wrap: nowrap;
  white-space: nowrap;
  transition-delay: 75ms;
}

:where([data-playing] .vds-audio-layout .vds-title) {
  opacity: 0;
  margin: 0;
  max-width: 0px;
  transition: none;
  transition-delay: 0;
}

:where(.vds-audio-layout .vds-title-text) {
  display: inline-flex;
  align-items: center;
}

:where(.vds-audio-layout .vds-marquee .vds-title-text) {
  animation: vds-marquee 8s linear infinite;
}

:where(.vds-audio-layout .vds-title:hover *) {
  animation-play-state: paused;
}

:where(.vds-audio-layout .vds-title-text:nth-child(2)) {
  margin-left: 16px;
}

@keyframes vds-marquee {
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(calc(-100% - 16px));
  }
}

/*
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Time
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

:where(.vds-audio-layout .vds-time) {
  margin-inline: 8px;
  transition: max-width 140ms ease-in;
  font-size: var(--audio-time-font-size, 15px);
}

/*
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Time Slider
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

:where(.vds-audio-layout .vds-time-slider) {
  --media-slider-preview-offset: 14px;
  opacity: 0;
  max-width: 0px;
  transform: scaleX(0);
  transform-origin: center left;
  transition: none;
  visibility: hidden;
}

:where([data-media-player]:not([data-paused]) .vds-audio-layout .vds-time-slider) {
  opacity: 1;
  max-width: 100%;
  transform: scaleX(1);
  transition:
    opacity 150ms ease-in,
    transform 150ms ease-in;
  transition-delay: 75ms;
  visibility: visible;
}

:where(.vds-audio-layout .vds-slider-chapter-title) {
  color: var(--audio-slider-chapter-title-color, black);
}

:where(.dark .vds-audio-layout .vds-slider-chapter-title) {
  color: var(--audio-slider-chapter-title-color, white);
}

:where([data-buffering] .vds-audio-layout .vds-slider-progress) {
  --stripe-color: var(--audio-buffering-stripe-color, rgb(0 0 0 / 0.25));
  --stripe-size: var(--audio-buffering-stripe-size, 30px);
  width: 100% !important;
  background-image: linear-gradient(
    -45deg,
    var(--stripe-color) 25%,
    transparent 25%,
    transparent 50%,
    var(--stripe-color) 50%,
    var(--stripe-color) 75%,
    transparent 75%,
    transparent
  );
  background-size: var(--stripe-size) var(--stripe-size);
  animation: vds-audio-track-progress var(--audio-buffering-stripe-speed, 2s) linear infinite;
}

@keyframes vds-audio-track-progress {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: var(--stripe-size) var(--stripe-size);
  }
}

/*
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Volume Slider
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

:where(.vds-audio-layout .vds-volume) {
  --media-slider-height: var(--audio-volume-height, 96px);
  --media-slider-preview-offset: 6px;
  --gap: var(--audio-volume-gap, 16px);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

:where(.vds-audio-layout .vds-volume-popup) {
  position: absolute;
  bottom: calc(100% + var(--gap));
  left: 50%;
  opacity: 0;
  transform: translateX(-50%);
  transition:
    opacity 150ms ease-out,
    visibility 150ms ease-out;
  border-radius: var(--audio-volume-border-radius, 8px);
  filter: var(--media-volume-filter, drop-shadow(0 1px 1px rgb(0 0 0 / 0.05)));
  visibility: hidden;
}

/* safe area. */
.vds-audio-layout .vds-volume-popup::after {
  content: '';
  position: fixed;
  bottom: calc(-1 * var(--gap));
  right: 0;
  width: 100%;
  height: var(--gap);
  z-index: 1;
  pointer-events: auto;
}

.vds-audio-layout .vds-volume-popup {
  background-color: var(--audio-volume-bg, var(--media-menu-bg, var(--default-bg)));
  border: var(--audio-volume-border, var(--default-border));
}

.light .vds-audio-layout .vds-volume-popup,
.vds-audio-layout.light .vds-volume-popup {
  --default-bg: rgb(250 250 250);
  --default-border: 1px solid rgb(10 10 10 / 0.1);
}

.dark .vds-audio-layout .vds-volume-popup,
.vds-audio-layout.dark .vds-volume-popup {
  --default-bg: rgb(10 10 10);
  --default-border: 1px solid rgb(255 255 255 / 0.1);
}

:where(.vds-audio-layout .vds-volume[data-active] .vds-volume-popup),
:where(.vds-audio-layout .vds-volume:has([data-active]) .vds-volume-popup) {
  transition:
    opacity 150ms ease-in,
    visibility 150ms ease-in;
  opacity: 1;
  visibility: visible;
}

:where(.vds-audio-layout .vds-volume[data-active] .vds-tooltip-content) {
  display: none !important;
}

/*
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Menus
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

:where(.vds-audio-layout .vds-menu-items[data-root]) {
  max-height: var(--audio-menu-max-height, 320px);
}

/*
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Captions
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

:where(.vds-audio-layout .vds-captions) {
  --cue-font-size: calc(var(--audio-cue-font-size, 14px) * var(--media-user-font-size, 1));
  display: inline-block;
  position: absolute;
  width: 100%;
  top: unset;
  bottom: calc(100% + var(--audio-captions-offset, 4px));
  text-align: center;
  background-color: var(--media-user-display-bg, var(--media-cue-display-bg));
}

:where([data-preview] .vds-audio-layout .vds-captions),
:where([data-paused] .vds-audio-layout .vds-captions) {
  opacity: 0;
}

@media (pointer: coarse) {
  .vds-audio-layout[data-scrubbing] :where(.vds-button, .vds-time) {
    max-width: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    transition: max-width 150ms ease-out;
  }
}

`;
