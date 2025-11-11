import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom-v5-compat";
import { useFromStore } from "hooks";
import { passwordsAPI, requests } from "api";
import Form, { Unwrapped } from "global/components/form";
import { entityStoreActions, currentUserActions } from "actions";
import { get } from "lodash";

const { request, flush } = entityStoreActions;

export default function PasswordResetContainer() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resetToken } = useParams();
  const response = useFromStore({
    path: `entityStore.responses.${requests.gPasswordReset}`
  });
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  useEffect(() => {
    return () => {
      dispatch(flush([requests.gPasswordReset]));
    };
  }, [dispatch]);

  const loginUser = user => {
    dispatch(
      currentUserActions.login({
        email: user.attributes.email,
        password
      })
    );
  };

  const redirectToHome = () => {
    navigate("/");
  };

  const postUpdate = data => {
    loginUser(data);
    redirectToHome();
  };

  const handleSubmit = event => {
    event.preventDefault(event.target);
    const action = passwordsAPI.update(
      password,
      passwordConfirmation,
      resetToken
    );
    const changeRequest = request(action, requests.gPasswordReset);
    dispatch(changeRequest).promise.then(res => {
      postUpdate(res.data);
    });
  };

  const handleInputChange = event => {
    const name = event.target.name.replace("attributes[", "").replace("]", "");
    if (name === "password") {
      setPassword(event.target.value);
    } else if (name === "passwordConfirmation") {
      setPasswordConfirmation(event.target.value);
    }
  };

  const errors = get(response, "errors") || [];

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
