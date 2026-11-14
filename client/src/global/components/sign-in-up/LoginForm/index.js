import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import actions from "actions/currentUser";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Notifications from "global/containers/Notifications";
import { useDispatch } from "react-redux";
import {
  handleAuthenticationSuccess,
  handleAuthenticationFailure
} from "store/middleware/currentUserMiddleware";
import Form from "global/components/form";
import { tokensAPI } from "api";
import { useFromStore, useAccountLink } from "hooks";
import { resolveAuthRedirect } from "helpers/router/authRedirect";
import OAuthProviderButton from "../oauth/OAuthProviderButton";
import * as Styled from "./styles";
import * as SharedStyles from "../styles";

// The API returns link failures as { errors: ["message"] } (plain strings),
// not JSON:API error objects.
const getLinkFailureMessage = (err, fallback) => {
  const first = err?.body?.errors?.[0];
  if (typeof first === "string") return first;
  if (typeof first?.detail === "string") return first.detail;
  return fallback;
};

export default function LoginForm({
  handleViewChange,
  hideOverlay,
  willRedirect
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    email: linkEmail,
    token: linkToken,
    error: linkParamError,
    isLinking
  } = useAccountLink();
  const [linkFailure, setLinkFailure] = useState(null);
  // The form session reopens when the model identity changes, so memoize it.
  const model = useMemo(() => (isLinking ? { email: linkEmail } : undefined), [
    isLinking,
    linkEmail
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const authentication = useFromStore({ path: "authentication" });
  const error = authentication?.error?.body;
  const settings = useFromStore({ requestKey: "settings", action: "select" });
  const {
    hideLocalLogin,
    identityProviders
  } = settings?.attributes?.authentication;

  const formatData = data => {
    dispatch(actions.loginStart());
    setIsLoading(true);
    setLinkFailure(null);
    // In link mode the email is fixed by the link and never user-supplied.
    if (isLinking) {
      return {
        email: linkEmail,
        password: data.password,
        accountLinkToken: linkToken
      };
    }
    return { email: data.email, password: data.password };
  };

  const onSuccess = useCallback(
    (_, res) => {
      setIsLoading(false);

      const { authToken } = res.meta ?? {};
      if (!authToken) {
        handleAuthenticationFailure(dispatch, {
          status: 500,
          destroyCookie: true
        });
        return;
      }
      handleAuthenticationSuccess(dispatch, {
        authToken,
        user: res,
        setCookie: true
      }).then(() => {
        if (isLinking && res.meta.redirect) {
          // The API tells us where the LTI launch was headed.
          navigate(resolveAuthRedirect(res.meta.redirect), { replace: true });
        } else if (hideOverlay) {
          hideOverlay();
        }
      });
    },
    [dispatch, hideOverlay, setIsLoading, isLinking, navigate]
  );

  const onError = useCallback(
    err => {
      setIsLoading(false);

      if (isLinking) {
        if (err?.status === 422) {
          // Correct credentials, but the link itself failed. This is not a
          // credential failure, so don't show the login error or destroy the
          // cookie. Just clear the loading state and explain.
          setLinkFailure(
            getLinkFailureMessage(
              err,
              t("forms.signin_overlay.account_link_error")
            )
          );
          dispatch(actions.loginComplete());
          return;
        }
        // Don't destroy a pre-existing session over a mistyped password.
        handleAuthenticationFailure(dispatch, {
          status: err?.status,
          destroyCookie: false
        });
        return;
      }

      handleAuthenticationFailure(dispatch, {
        status: err.status,
        destroyCookie: true
      });
    },
    [dispatch, setIsLoading, isLinking, t]
  );

  const storeError = error && !isLoading ? error : null;
  const displayedError = linkFailure ?? storeError ?? linkParamError;
  const errorList = displayedError ? [{ detail: displayedError }] : [];

  // Shared by both branches below so OAuth-only setups still see it.
  const linkInstructions = isLinking && (
    <Styled.LinkInstructions>
      {t("forms.signin_overlay.account_link_instructions", {
        email: linkEmail
      })}
    </Styled.LinkInstructions>
  );

  return (
    <div>
      {willRedirect && (
        <Styled.NotificationsWrapper>
          <Notifications
            scope="authentication"
            style="drawer"
            animate={false}
            noDismiss
          />
        </Styled.NotificationsWrapper>
      )}
      <div>
        {!hideLocalLogin ? (
          <SharedStyles.Form
            name="global-login"
            create={tokensAPI.loginForm}
            onSuccess={onSuccess}
            onError={onError}
            formatData={formatData}
            model={model}
          >
            <>
              <Form.Header
                label={t("forms.signin_overlay.log_in")}
                styleType="primary"
              />
              {linkInstructions}
              <Form.FieldGroup>
                <Form.TextInput
                  focusOnMount={!isLinking}
                  isDisabled={isLinking}
                  inputType="email"
                  name="email"
                  id="login-email"
                  placeholder={t("forms.signin_overlay.email")}
                  inputMode="email"
                  label={t("forms.signin_overlay.email")}
                  autoComplete="email"
                  ariaRequired
                />
                <Form.TextInput
                  password
                  focusOnMount={isLinking}
                  name="password"
                  id="login-password"
                  placeholder={t("forms.signin_overlay.password")}
                  label={t("forms.signin_overlay.password")}
                  autoComplete="current-password"
                  ariaRequired
                />
              </Form.FieldGroup>
              <Form.InputError errors={errorList} />
              <input
                type="submit"
                className="button-secondary"
                value={t("forms.signin_overlay.log_in")}
              />
            </>
          </SharedStyles.Form>
        ) : (
          <Form.Header
            label={t("forms.signin_overlay.log_in")}
            styleType="primary"
          />
        )}
        {hideLocalLogin && (
          <>
            {linkInstructions}
            {/* Form.InputError doesn't depend on the form context. */}
            <Form.InputError errors={errorList} />
          </>
        )}
        {!!identityProviders?.length && (
          <Styled.OauthWrapper>
            {identityProviders.map(provider => (
              <OAuthProviderButton
                key={provider.name}
                provider={provider}
                icon="Privacy24"
              />
            ))}
          </Styled.OauthWrapper>
        )}
        {!hideLocalLogin && (
          <SharedStyles.LinksWrapper>
            <SharedStyles.ViewLink
              onClick={e => handleViewChange("password", e)}
            >
              {t("forms.signin_overlay.forgot_password")}
            </SharedStyles.ViewLink>
            {!isLinking && (
              <SharedStyles.ViewLink
                onClick={e => handleViewChange("terms", e)}
              >
                {t("forms.signin_overlay.need_account")}
              </SharedStyles.ViewLink>
            )}
          </SharedStyles.LinksWrapper>
        )}
      </div>
    </div>
  );
}

LoginForm.displayName = "Global.SignInUp.LoginForm";

LoginForm.propTypes = {
  handleViewChange: PropTypes.func,
  hideOverlay: PropTypes.func,
  willRedirect: PropTypes.bool
};
