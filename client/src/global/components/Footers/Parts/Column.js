import React from "react";
import classNames from "classnames";

export default function FooterColumn({ position, children }) {
  const classes = classNames("app-footer__column", {
    "app-footer__column--right": position === "right",
    "app-footer__column--left": position === "left"
  });

  return <div className={classes}>{children}</div>;
}
