import React from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

export default function Button({
  icon,
  iconSize = "default",
  iconLeft = false,
  label,
  onClick,
  type = "button",
  styleType = "fill",
  disabled,
  className
}) {
  const { t } = useTranslation();

  const classes = classNames(
    "button-secondary",
    {
      "button-secondary--outlined button-secondary--color-white":
        styleType === "outline",
      "button-secondary--dark": styleType === "dark"
    },
    className
  );

  return (
    <Styled.Button
      className={classes}
      onClick={typeof onClick === "function" ? onClick : undefined}
      type={type}
      aria-disabled={disabled}
      disabled={disabled}
    >
      {iconLeft && (
        <IconComposer
          icon={icon}
          size={iconSize}
          className="button-secondary__icon"
        />
      )}
      <span className="button-secondary__text">{t(label)}</span>
      {!iconLeft && icon && (
        <IconComposer
          icon={icon}
          size={iconSize}
          className="button-secondary__icon"
        />
      )}
    </Styled.Button>
  );
}
