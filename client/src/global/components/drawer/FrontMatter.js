import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import Utility from "global/components/utility";

export default function FrontMatter(props) {
  const {
    title,
    icon,
    closeCallback,
    closeUrl,
    context,
    padding,
    includeDrawerFrontMatter = true,
    includeSRCloseButton = true,
    headerId,
    handleLeaveEvent
  } = props;

  const hasTitle = title || icon;
  const hasClose = closeCallback || closeUrl;

  const { t } = useTranslation();

  const drawerBarClasses = classNames({
    "drawer-bar": true,
    "drawer-bar--pad-lateral": padding === "none",
    "drawer-bar--default": context !== "reader",
    "drawer-bar--reader": context === "reader"
  });

  const closeButtonClasses = classNames({
    "drawer-bar__close-button": true,
    "drawer-bar__close-button--light": context === "backend",
    "drawer-bar__close-button--dark": context !== "backend"
  });

  return (
    <>
      {includeDrawerFrontMatter && (
        <div className={drawerBarClasses}>
          {hasTitle ? (
            <div className="drawer-bar__title">
              {icon && (
                <Utility.IconComposer
                  icon={icon}
                  size={24}
                  className="drawer-bar__title-icon"
                />
              )}
              {title && (
                <span id={headerId} className="drawer-bar__title-text">
                  {typeof title === "object" ? t(title.key) : title}
                </span>
              )}
            </div>
          ) : null}
          {hasClose ? (
            <button
              onClick={handleLeaveEvent}
              tabIndex="0"
              className={closeButtonClasses}
            >
              <span className="drawer-bar__close-text">
                {t("actions.close")}
              </span>
              <Utility.IconComposer
                icon="close24"
                size={24}
                className="drawer-bar__close-icon"
              />
            </button>
          ) : null}
        </div>
      )}
      {!hasClose && includeSRCloseButton && (
        <button
          onClick={handleLeaveEvent}
          tabIndex="0"
          className="screen-reader-text"
        >
          {t("actions.close")}
        </button>
      )}
    </>
  );
}

FrontMatter.displayName = "Drawer.FrontMatter";

FrontMatter.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  closeCallback: PropTypes.func,
  closeUrl: PropTypes.string,
  context: PropTypes.oneOf(["backend", "frontend", "reader"]),
  padding: PropTypes.oneOf(["none", "default", "large"]),
  includeDrawerFrontMatter: PropTypes.bool,
  includeSRCloseButton: PropTypes.bool,
  headerId: PropTypes.string.isRequired,
  handleLeaveEvent: PropTypes.func.isRequired
};
