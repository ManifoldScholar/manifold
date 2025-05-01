import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import SetForm from "./Set";
import * as Styled from "./styles";

export default function ResetPasswordMenu({
  setConfirm,
  reject,
  resolve,
  user,
}) {
  const { t } = useTranslation();

  const [showSetForm, toggleSetForm] = useState(false);

  const buttons = (
    <div className="dialog__body">
      <Styled.ButtonGroup>
        <button
          onClick={() => setConfirm(true)}
          className="button-secondary button-secondary--outlined"
        >
          {t("forms.password_reset.generate_password")}
        </button>
        <button
          onClick={() => toggleSetForm(true)}
          className="button-secondary button-secondary--outlined"
        >
          {t("forms.password_reset.set_password")}
        </button>
        <button
          className={classNames(
            "button-secondary",
            "button-secondary--outlined",
            "button-secondary--dull",
          )}
          onClick={() => reject()}
        >
          <span
            className={classNames(
              "button-secondary__text",
              "button-secondary__text--white",
              "button-secondary__text--hover-dark",
            )}
          >
            {t("actions.cancel")}
          </span>
        </button>
      </Styled.ButtonGroup>
    </div>
  );

  return (
    <div>
      <header className="dialog__header">
        <h2>
          {showSetForm ? t("modals.set_password") : t("modals.password_reset")}
        </h2>
      </header>
      <p>
        {showSetForm
          ? t("modals.set_password_body")
          : t("modals.password_reset_body")}
      </p>
      {showSetForm ? (
        <SetForm user={user} resolve={resolve} toggleSetForm={toggleSetForm} />
      ) : (
        buttons
      )}
    </div>
  );
}
