import React from "react";
import { Link } from "react-router-dom";
import Utility from "global/components/utility";
import has from "lodash/has";
import { Translation } from "react-i18next";

export default function FooterPartsNavigationLink({
  item,
  hideLabel,
  className
}) {
  const icon = theItem => {
    if (!theItem.icon) return null;
    return (
      <Utility.IconComposer
        icon={theItem.icon}
        size={24}
        className="app-footer-navigation__icon"
      />
    );
  };

  if (item.to)
    return (
      <Translation>
        {t => (
          <Link
            to={item.to}
            target={item.openInNewTab ? "_blank" : null}
            className={className}
          >
            {icon(item)}
            {!hideLabel && (
              <span className="app-footer-navigation__link-text">
                {t(item.title)}
              </span>
            )}
          </Link>
        )}
      </Translation>
    );

  if (has(item, "href")) {
    const target = item.target || item.openInNewTab ? "_blank" : null;
    return (
      <a target={target} rel={item.rel} href={item.href} className={className}>
        {icon(item)}
        {!hideLabel && item.title}
      </a>
    );
  }

  if (has(item, "onClick"))
    return (
      <Translation>
        {t => (
          <span
            role="button"
            tabIndex="0"
            onClick={item.onClick}
            className={className}
          >
            {icon(item)}
            {!hideLabel && (
              <span className="app-footer-navigation__link-text">
                {t(item.title)}
              </span>
            )}
          </span>
        )}
      </Translation>
    );

  return null;
}
