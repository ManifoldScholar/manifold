import React from "react";
import isString from "lodash/isString";
import IconComposer from "global/components/utility/IconComposer";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export default function ConfirmModalBody({
  heading,
  message,
  id,
  resolve,
  reject,
  options
}) {
  const { t } = useTranslation();

  const defaultHeading = t("messages.confirm");

  const buttonClasses = classNames(
    "buttons-icon-horizontal__button",
    "buttons-icon-horizontal__button--in-dialog",
    "button-icon-secondary"
  );

  const handleResolveClick = event => {
    event.preventDefault();
    resolve(event);
  };

  const handleRejectClick = event => {
    event.preventDefault();
    reject(event);
  };

  const resolveLabel = options?.resolveLabel || t("common.yes_title_case");

  const rejectLabel =
    options?.rejectLabel ||
    (typeof resolve === "function"
      ? t("common.no_title_case")
      : t("common.okay"));

  return (
    <>
      <header className="dialog__header">
        <h2 id={`${id}-label`}>{heading ?? defaultHeading}</h2>
      </header>

      {isString(message) ? <p id={`${id}-description`}>{message}</p> : message}

      <div className="dialog__body">
        <div className="buttons-icon-horizontal">
          {typeof resolve === "function" && (
            <button
              onClick={handleResolveClick}
              className={buttonClasses}
              data-id="accept"
            >
              <IconComposer
                icon="checkmark16"
                size="default"
                className="button-icon-secondary__icon"
              />
              <span>{resolveLabel}</span>
            </button>
          )}
          <button
            className={classNames(buttonClasses, "button-icon-secondary--dull")}
            onClick={handleRejectClick}
            data-id="reject"
          >
            <IconComposer
              icon="close16"
              size="default"
              className="button-icon-secondary__icon"
            />
            <span>{rejectLabel}</span>
          </button>
        </div>
      </div>
    </>
  );
}

ConfirmModalBody.displayName = "Global.Dialog.Confirm.Body";

ConfirmModalBody.propTypes = {
  heading: PropTypes.string,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  resolve: PropTypes.func,
  reject: PropTypes.func.isRequired,
  options: PropTypes.object
};
