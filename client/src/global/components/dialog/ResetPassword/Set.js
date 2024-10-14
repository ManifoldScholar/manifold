import React, { useState } from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { usersAPI } from "api";
import { FormContext } from "helpers/contexts";
import { Unwrapped } from "global/components/form";
import { useApiCallback } from "hooks";
import * as Styled from "./styles";

export default function SetNewPassword({ user, resolve, toggleSetForm }) {
  const { t } = useTranslation();

  const [password, setPassword] = useState(null);
  const [errors, setErrors] = useState([]);

  const updatePassword = useApiCallback(usersAPI.update);

  const resetUserPassword = e => {
    e.preventDefault();
    const adjustedUser = {
      type: user.type,
      id: user.id,
      attributes: { password }
    };

    updatePassword(user.id, adjustedUser)
      .then(resolve())
      .catch(err => setErrors(err));
  };

  const id = "reset-password";
  const errorId = id + "-error";

  return (
    <form method="put" className="dialog__body" onSubmit={resetUserPassword}>
      <FormContext.Provider value={{ styleType: "secondary" }}>
        <Unwrapped.Input
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          id={id}
          placeholder={t("forms.password_reset.new")}
          aria-describedby={errorId}
          name="attributes[password]"
          errors={errors}
          idForError={errorId}
          label={t("forms.password_reset.new")}
        />
        <Styled.ButtonGroup>
          <input
            className={classNames(
              "button-secondary",
              "button-secondary--wide",
              "button-secondary--outlined",
              "button-secondary--with-room"
            )}
            type="submit"
            value={t("forms.password_reset.submit_reset")}
          />
          <button
            className={classNames(
              "button-secondary",
              "button-secondary--wide",
              "button-secondary--outlined",
              "button-secondary--dull"
            )}
            onClick={() => toggleSetForm(false)}
          >
            {t("actions.cancel")}
          </button>
        </Styled.ButtonGroup>
      </FormContext.Provider>
    </form>
  );
}
