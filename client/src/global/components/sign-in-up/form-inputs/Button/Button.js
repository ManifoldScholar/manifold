import React from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";

export default function Button({
  icon,
  iconSize = "default",
  iconLeft = false,
  label,
  onClick,
  type = "button",
  styleType = "fill",
  disabled
}) {
  const { t } = useTranslation();

  const className = classNames("button-secondary", {
    "button-secondary--outlined button-secondary--color-white":
      styleType === "outline",
    "button-secondary--with-room": styleType === "fill",
    "button-secondary--dark": styleType === "dark"
  });

  return (
    <button
      className={className}
      style={{ width: "100%" }}
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
    </button>
  );
}
