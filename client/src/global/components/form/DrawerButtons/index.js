import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom-v5-compat";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

export default function DrawerButtons({
  showCancel = false,
  showSaveAndClose = false,
  cancelUrl,
  submitLabel = "actions.save",
  disableSubmit = false,
  onSaveClick,
  onSaveAndCloseClick,
  saveRef,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const buttonClasses = "button-secondary button-secondary--outlined";

  const handleCancelClick = (e) => {
    e.preventDefault();
    navigate(cancelUrl ?? -1);
  };

  return (
    <Styled.ButtonGroup>
      <Styled.ButtonWithDisable
        type="submit"
        className={classNames(buttonClasses, {
          "button-secondary--dull": disableSubmit,
          disabled: disableSubmit,
        })}
        disabled={disableSubmit}
        onClick={onSaveClick}
        ref={saveRef}
      >
        <span>{t(submitLabel)}</span>
      </Styled.ButtonWithDisable>
      {showSaveAndClose && (
        <Styled.ButtonWithDisable
          type="submit"
          className={classNames(buttonClasses, {
            "button-secondary--dull": disableSubmit,
            disabled: disableSubmit,
          })}
          disabled={disableSubmit}
          onClick={onSaveAndCloseClick}
        >
          <span>{t("actions.save_and_close")}</span>
        </Styled.ButtonWithDisable>
      )}
      {showCancel && (
        <button
          onClick={handleCancelClick}
          className={classNames(buttonClasses, "button-secondary--dull")}
        >
          <span>{t("actions.cancel")}</span>
        </button>
      )}
    </Styled.ButtonGroup>
  );
}

DrawerButtons.propTypes = {
  showCancel: PropTypes.bool,
  cancelUrl: PropTypes.string,
  submitLabel: PropTypes.string,
  disableSubmit: PropTypes.bool,
};
