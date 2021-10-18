import {
  utilityPrimary,
  setFocusStyle,
  defaultHoverStyle,
  respond,
  transparentize
} from "theme/styles/mixins";

export default `
  .audio-player {
    --hover-color: var(--color-interaction-light);

    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .cover {
      ${setFocusStyle}
      position: absolute;
      top: 0;
      left: 0;
      z-index: 50;
      width: 100%;
      height: 100%;
      cursor: pointer;
      background: ${transparentize("neutralBlack", 0.5)};

      &.error {
        pointer-events: none;
        cursor: default;

        .message {
          ${utilityPrimary}
          position: absolute;
          top: calc(50% + (60px - 7px));
          width: 100%;
          padding: 0 10px;
          font-size: 14px;
          color: var(--color-base-neutral-white);
          text-align: center;
        }
      }

      .indicator {
        position: absolute;
        top: calc(50% - 35px);
        left: calc(50% - 35px);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 70px;
        height: 70px;
        padding: 1px 7px 2px;
        color: var(--color-base-neutral-white);
        text-align: center;
        background-color: var(--color-accent-primary);
        border: 0;
        border-radius: 50%;
      }
    }

    wave:hover {
      cursor: pointer;
    }

    .waveform {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      justify-content: center;
    }

    .control-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 15px 10px;

      ${respond(`padding: 0 25px 19px;`, 60)}

      button {
        padding: 0;
        background-color: transparent;
        border: 0;
        outline: none;

        &:hover,
        &:focus-visible {
          .audio-player__icon {
            ${defaultHoverStyle}
          }
        }
      }

      .progress {
        display: none;
        flex-grow: 1;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        font-variant-numeric: tabular-nums;

        ${respond(`display: flex;`, 40)}

        .slider {
          flex-grow: 1;
          margin: 0 15px;

          input[type="range"] {
            width: 100%;

            &::-webkit-slider-thumb {
              box-shadow: -1024px 0 0 1024px var(--color-base-neutral-white);
            }
          }
        }

        .time {
          ${utilityPrimary}
          font-size: 14px;
          color: var(--color-base-neutral-white);

          ${respond(`font-size: 19px;`, 60)}

          &.duration {
            color: var(--color-base-neutral80);
          }
        }
      }

      .volume {
        text-align: left;

        .mute {
          display: inline-block;
          width: 35px;
          text-align: left;

          ${respond(`margin-right: 7px;`, 60)}
        }
      }

      .slider {
        position: relative;
        display: inline-block;

        .input-thumb {
          position: absolute;
          left: 0;
          width: 20px;
          height: 20px;
          pointer-events: none;
          background: var(--color-accent-primary);
          border: 3px solid var(--color-base-neutral-black);
          border-radius: 50%;
        }

        input[type="range"] {
          width: 70px;
          height: 0;
          padding: 5px 0 0;
          margin-top: 1px;
          overflow: hidden;
          vertical-align: middle;
          background: var(--color-base-neutral80);
          border-radius: 0;
          outline: 0;
          appearance: none;

          &:hover {
            cursor: pointer;
          }

          &::-webkit-slider-runnable-track {
            height: 3px;
            appearance: none;
          }

          &::-webkit-slider-thumb {
            width: 1px;
            height: 1px;
            margin-top: -9px;
            background: transparent;
            box-shadow: -70px 0 0 70px var(--color-base-neutral-white);
            appearance: none;
          }

          &::-ms-fill-lower,
          &::-moz-range-progress {
            color: var(--color-base-neutral80);
          }
        }
      }
    }

    &__icon {
      position: relative;
      color: var(--color-base-neutral-white);
      transition: color var(--transition-duration-fast)
        var(--transition-timing-function);

      &--play-pause {
        top: 1px;

        ${respond(
          `width: 32px;
        height: 32px;`,
          60
        )}
      }

      &--mute {
        ${respond(
          `top: 1px;
        width: 27.429px;
        height: 27.429px;`,
          60
        )}
      }
    }
  }
`;
