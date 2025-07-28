import {
  Menu,
  Tooltip,
  useCaptionOptions,
  useMediaState
  // type MenuPlacement,
  // type TooltipPlacement,
} from "@vidstack/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClosedCaptionsIcon,
  SettingsIcon,
  MuteIcon,
  CheckIcon,
  VolumeLowIcon,
  VolumeHighIcon
} from "@vidstack/react/icons";
import { Speed as SpeedSlider, Volume as VolumeSlider } from "../Sliders";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

// export interface SettingsProps {
//   placement: MenuPlacement;
//   tooltipPlacement: TooltipPlacement;
// }

export function Volume({ tooltipPlacement }) {
  const isMuted = useMediaState("muted");
  const volume = useMediaState("volume");
  const { t } = useTranslation();

  return (
    <Menu.Root className="vds-menu">
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Menu.Button className="vds-menu-button vds-button">
            {/* eslint-disable no-nested-ternary */}
            {isMuted || volume === 0 ? (
              <MuteIcon />
            ) : volume < 0.5 ? (
              <VolumeLowIcon />
            ) : (
              <VolumeHighIcon />
            )}
            <span className="screen-reader-text">{t("actions.adjust_volume")}</span>
          </Menu.Button>
        </Tooltip.Trigger>
        <Tooltip.Content
          className="vds-tooltip-content"
          placement={tooltipPlacement}
        >
          {t("actions.adjust_volume")}
        </Tooltip.Content>
      </Tooltip.Root>
      <Styled.VolumeMenuContent placement="top center">
        <VolumeSlider orientation="vertical" />
      </Styled.VolumeMenuContent>
    </Menu.Root>
  );
}

export function Settings({ placement, tooltipPlacement }) {
  const { t } = useTranslation();

  return (
    <Menu.Root className="vds-menu">
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Menu.Button className="vds-menu-button vds-button">
            <SettingsIcon className="vds-rotate-icon" />
            <span className="screen-reader-text">{t("common.settings")}</span>
          </Menu.Button>
        </Tooltip.Trigger>
        <Tooltip.Content
          className="vds-tooltip-content"
          placement={tooltipPlacement}
        >
          {t("common.settings")}
        </Tooltip.Content>
      </Tooltip.Root>
      <Menu.Content className="vds-menu-items" placement={placement}>
        <CaptionSubmenu />
        {/* <SpeedSlider /> */}
      </Menu.Content>
    </Menu.Root>
  );
}

function CaptionSubmenu() {
  const options = useCaptionOptions();
  const { t } = useTranslation();

  const hint = options.selectedTrack?.label ?? t("actions.off");

  return (
    <Menu.Root>
      <SubmenuButton
        label={t("records.tracks.kind_captions")}
        hint={hint}
        disabled={options.disabled}
        icon={ClosedCaptionsIcon}
      />
      <Menu.Content className="vds-menu-items">
        <Menu.RadioGroup
          className="vds-radio-group"
          value={options.selectedValue}
        >
          {options.map(({ label, value, select }) => (
            <Menu.Radio
              className="vds-radio"
              value={value}
              onSelect={select}
              key={value}
            >
              <CheckIcon className="vds-icon" />
              <span className="vds-radio-label">{label}</span>
            </Menu.Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

// export interface SubmenuButtonProps {
//   label: string;
//   hint: string;
//   disabled?: boolean;
//   icon: ReactNode;
// }

function SubmenuButton({ label, hint, icon: Icon, disabled }) {
  return (
    <Menu.Button className="vds-menu-item" disabled={disabled}>
      <ChevronLeftIcon className="vds-menu-close-icon" />
      <Icon className="vds-icon" />
      <span className="vds-menu-item-label">{label}</span>
      <span className="vds-menu-item-hint">{hint}</span>
      <ChevronRightIcon className="vds-menu-open-icon" />
    </Menu.Button>
  );
}
