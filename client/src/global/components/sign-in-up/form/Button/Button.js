import React from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";

export default function Button({
  icon,
  label,
  onClick,
  type,
  styleType = "fill"
}) {
  const { t } = useTranslation();

  const className = classNames("button-secondary", {
    "button-secondary--outlined button-secondary--color-white":
      styleType === "outline",
    "button-secondary--with-room": styleType === "fill"
  });

  return (
    <button
      className={className}
      style={{ width: "100%" }}
      onClick={typeof onClick === "function" ? onClick : undefined}
      type={type}
    >
      <span className="button-secondary__text">{t(label)}</span>
      {icon && (
        <IconComposer
          icon={icon}
          size="default"
          className="button-secondary__icon"
        />
      )}
    </button>
  );
}
