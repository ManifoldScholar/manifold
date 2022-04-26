import styled from "@emotion/styled";
import IconComposer from "global/components/utility/IconComposer";
import { transientOptions } from "helpers/emotionHelpers";
import {
  utilityPrimary,
  setFocusStyle,
  respond,
  fluidScale,
  transparentize
} from "theme/styles/mixins";

export const Player = styled.div`
  --hover-color: var(--color-interaction-light);
  --focus-color: var(--color-interaction-light);

  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const Cover = styled("div", transientOptions)`
  ${setFocusStyle()}
  position: absolute;
  top: 0;
  left: 0;
  z-index: 50;
  width: 100%;
  height: 100%;
  cursor: pointer;
  background: ${transparentize("neutralBlack", 0.5)};

  ${({ $isError }) =>
    $isError &&
    `
      pointer-events: none;
      cursor: default;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
  `}
`;

export const ErrorMessage = styled.div`
  ${utilityPrimary}
  padding: 0 10px;
  margin-top: 1.25em;
  font-size: 14px;
  color: var(--color-base-neutral-white);
  text-align: center;
`;

export const Indicator = styled("div", transientOptions)`
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

  ${({ $absoluteCenter }) =>
    $absoluteCenter &&
    `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    `}
`;

export const WaveForm = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
`;

export const ControlBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${fluidScale("25px", "15px")} ${fluidScale("19px", "10px")};

  button {
    padding: 0;
    background-color: transparent;
    border: 0;
    outline: none;

    &:hover,
    &.focus-visible {
      --Icon-color: var(--hover-color);
    }
  }
`;

export const Progress = styled.div`
  --Slider-flex-grow: 1;
  --Slider-margin: 0 15px;
  --RangeInput-width: 100%;
  --RangeInput-box-shadow: -1024px 0 0 1024px var(--color-base-neutral-white);

  display: none;
  flex-grow: 1;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  font-variant-numeric: tabular-nums;

  ${respond(`display: flex;`, 40)}
`;

export const Slider = styled.div`
  position: relative;
  display: inline-block;
  flex-grow: var(--Slider-flex-grow, 0);
  margin: var(--Slider-margin, 0);
`;

export const Time = styled.div`
  ${utilityPrimary}
  font-size: 14px;
  color: var(--color-base-neutral-white);

  ${respond(`font-size: 19px;`, 60)}

  &.duration {
    color: var(--color-base-neutral80);
  }
`;

export const Volume = styled.div`
  text-align: left;
`;

export const Mute = styled.button`
  display: inline-block;
  width: 35px;
  text-align: left;

  ${respond(`margin-right: 7px;`, 60)}
`;

export const ThumbInput = styled.div`
  position: absolute;
  left: 0;
  width: 20px;
  height: 20px;
  pointer-events: none;
  background: var(--color-accent-primary);
  border: 3px solid var(--color-base-neutral-black);
  border-radius: 50%;
`;

export const RangeInput = styled.input`
  width: var(--RangeInput-width, 70px);
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
    box-shadow: var(
      --RangeInput-box-shadow,
      -70px 0 0 70px var(--color-base-neutral-white)
    );
    appearance: none;
  }

  &::-moz-range-progress {
    color: var(--color-base-neutral80);
  }
`;

const iconStyles = `
  position: relative;
  color: var(--Icon-color, var(--color-base-neutral-white));
  transition: color var(--transition-duration-fast)
    var(--transition-timing-function);
`;

export const PlayPauseIcon = styled(IconComposer)`
  ${iconStyles}
  top: 1px;

  ${respond(
    `width: 32px;
        height: 32px;`,
    60
  )}
`;

export const MuteIcon = styled(IconComposer)`
  ${iconStyles}

  ${respond(
    `top: 1px;
        width: 27.429px;
        height: 27.429px;`,
    60
  )}
`;
