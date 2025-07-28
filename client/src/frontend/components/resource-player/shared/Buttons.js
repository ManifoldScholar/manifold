import {
  CaptionButton,
  FullscreenButton,
  isTrackCaptionKind,
  MuteButton,
  PIPButton,
  PlayButton,
  SeekButton,
  Tooltip,
  useMediaState
} from "@vidstack/react";
import {
  ClosedCaptionsIcon,
  ClosedCaptionsOnIcon,
  FullscreenExitIcon,
  FullscreenIcon,
  MuteIcon,
  PauseIcon,
  PictureInPictureExitIcon,
  PictureInPictureIcon,
  PlayIcon,
  SeekBackward10Icon,
  SeekForward10Icon,
  VolumeHighIcon,
  VolumeLowIcon
} from "@vidstack/react/icons";
import { useTranslation } from "react-i18next";

// export interface MediaButtonProps {
//   tooltipPlacement: TooltipPlacement;
// }

export function Play({ tooltipPlacement }) {
  const isPaused = useMediaState("paused");
  const { t } = useTranslation();

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <PlayButton className="vds-button">
          {isPaused ? <PlayIcon /> : <PauseIcon />}
        </PlayButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        className="vds-tooltip-content"
        placement={tooltipPlacement}
      >
        {isPaused ? t("actions.play") : t("actions.pause")}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function Mute({ tooltipPlacement }) {
  const volume = useMediaState("volume");
  const isMuted = useMediaState("muted");
  const { t } = useTranslation();

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <MuteButton className="vds-button">
          {/* eslint-disable no-nested-ternary */}
          {isMuted || volume === 0 ? (
            <MuteIcon />
          ) : volume < 0.5 ? (
            <VolumeLowIcon />
          ) : (
            <VolumeHighIcon />
          )}
        </MuteButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        className="vds-tooltip-content"
        placement={tooltipPlacement}
      >
        {isMuted ? t("actions.unmute") : t("actions.mute")}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function Caption({ tooltipPlacement }) {
  const track = useMediaState("textTrack");
  const isOn = track && isTrackCaptionKind(track);
  const { t } = useTranslation();

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <CaptionButton className="vds-button">
          {isOn ? <ClosedCaptionsOnIcon /> : <ClosedCaptionsIcon />}
        </CaptionButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        className="vds-tooltip-content"
        placement={tooltipPlacement}
      >
        {isOn ? t("actions.captions_on") : t("actions.captions_off")}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function PIP({ tooltipPlacement }) {
  const isActive = useMediaState("pictureInPicture");
  const { t } = useTranslation();

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <PIPButton className="vds-button">
          {isActive ? <PictureInPictureExitIcon /> : <PictureInPictureIcon />}
        </PIPButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        className="vds-tooltip-content"
        placement={tooltipPlacement}
      >
        {isActive ? t("actions.exit_pip") : t("actions.enter_pip")}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function Fullscreen({ tooltipPlacement }) {
  const isActive = useMediaState("fullscreen");
  const { t } = useTranslation();

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <FullscreenButton className="vds-button">
          {isActive ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </FullscreenButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        className="vds-tooltip-content"
        placement={tooltipPlacement}
      >
        {isActive
          ? t("actions.exit_fullscreen")
          : t("actions.enter_fullscreen")}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

// export interface SeekButtonProps extends MediaButtonProps {
//   seconds: number;
// }

export function Seek({ seconds, tooltipPlacement }) {
  const isBackward = seconds < 0;
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <SeekButton className="vds-button" seconds={seconds}>
          {isBackward ? <SeekBackward10Icon /> : <SeekForward10Icon />}
        </SeekButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        className="vds-tooltip-content"
        placement={tooltipPlacement}
      >
        {isBackward ? "Seek Backward" : "Seek Forward"}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
