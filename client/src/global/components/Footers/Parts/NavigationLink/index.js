import React from "react";
import { Link } from "react-router-dom";
import Utility from "global/components/utility";
import has from "lodash/has";
import classNames from "classnames";

export default function FooterPartsNavigationLink({
  item,
  hideLabel,
  className
}) {
  const icon = theItem => {
    if (!theItem.icon) return null;
    return <Utility.IconComposer icon={theItem.icon} size={24} />;
  };

  if (item.to)
    return (
      <Link
        to={item.to}
        target={item.openInNewTab ? "_blank" : null}
        className={className}
      >
        {icon(item)}
        {!hideLabel && (
          <span className="app-footer-navigation__link-text">{item.title}</span>
        )}
      </Link>
    );

  if (has(item, "href")) {
    const target = item.target || item.openInNewTab ? "_blank" : null;
    return (
      <a target={target} rel={item.rel} href={item.href} className={className}>
        {icon(item)}
        <span className={classNames({ "screen-reader-text": hideLabel })}>
          {item.title}
        </span>
      </a>
    );
  }

  if (has(item, "onClick"))
    return (
      <span
        role="button"
        tabIndex="0"
        onClick={item.onClick}
        className={className}
      >
        {icon(item)}
        {!hideLabel && (
          <span className={classNames({ "screen-reader-text": hideLabel })}>
            {item.title}
          </span>
        )}
      </span>
    );

  return null;
}
