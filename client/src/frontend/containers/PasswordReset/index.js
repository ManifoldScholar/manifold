import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { useApiCallback } from "hooks";
import { passwordsAPI } from "api";
import Form, { Unwrapped } from "global/components/form";
import { currentUserActions } from "actions";

export default function PasswordResetContainer() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resetToken } = useParams();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState([]);

  const updatePassword = useApiCallback(passwordsAPI.update);

  const loginUser = user => {
    dispatch(
      currentUserActions.login({
        email: user.attributes.email,
        password
      })
    );
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setErrors([]);
    try {
      const res = await updatePassword(
        password,
        passwordConfirmation,
        resetToken
      );
      loginUser(res.data);
      navigate("/");
    } catch (error) {
      if (error?.body?.errors) {
        setErrors(error.body.errors);
      }
    }
  };

  const handleInputChange = event => {
    const name = event.target.name.replace("attributes[", "").replace("]", "");
    if (name === "password") {
      setPassword(event.target.value);
    } else if (name === "passwordConfirmation") {
      setPasswordConfirmation(event.target.value);
    }
  };

  return (
    <section>
      <div className="container">
        <form method="post" onSubmit={handleSubmit}>
          <Form.Header
            styleType="primary"
            label={t("forms.password_reset.title")}
          />
          <Form.FieldGroup>
            <Unwrapped.Input
              value={password}
              type="password"
              name="attributes[password]"
              id="reset-password"
              onChange={handleInputChange}
              placeholder={t("forms.password_reset.new_placeholder")}
              aria-describedby="reset-password-error"
              errors={errors}
              idForError="reset-password-error"
              label={t("forms.password_reset.new")}
              wide
            />
            <Unwrapped.Input
              value={passwordConfirmation}
              type="password"
              id="reset-password-confirmation"
              onChange={handleInputChange}
              placeholder={t("forms.password_reset.confirm_placeholder")}
              aria-describedby="reset-password-confirmation-error"
              name="attributes[passwordConfirmation]"
              errors={errors}
              idForError="reset-password-confirmation-error"
              label={t("forms.password_reset.confirm")}
              wide
            />
            <Form.Errorable name="attributes[resetToken]" errors={errors}>
              <input
                className="button-secondary"
                type="submit"
                value={t("forms.password_reset.submit_reset")}
              />
            </Form.Errorable>
          </Form.FieldGroup>
        </form>
      </div>
    </section>
  );
}
