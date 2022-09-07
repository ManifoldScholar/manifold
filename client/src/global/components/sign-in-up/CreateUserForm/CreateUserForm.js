import React, { useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { usersAPI } from "api";
import { currentUserActions } from "actions";
import capitalize from "lodash/capitalize";
import OAuthOptions from "../oauth/OAuthLoginOptions";
import { useFromStore } from "hooks";
import { useUID } from "react-uid";
import CreateFormFields from "./CreateFormFields";
import BaseHookForm from "../BaseHookForm";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import * as Styled from "./styles";

export default function CreateUserForm({
  handleViewChange,
  willRedirect,
  redirectToHomeOnSignup
}) {
  const settings = useFromStore("settings", "select");
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const installationName = settings?.attributes?.general?.installationName;

  const focusRef = useRef();

  useEffect(() => {
    if (focusRef.current) focusRef.current.focus();
  }, []);

  const OAuthProviderNames = () => {
    if (!settings?.attributes?.oauth) return null;

    const providers = Object.values(settings.attributes.oauth).filter(
      provider => provider.enabled
    );
    if (!providers || !providers.length) return null;
    const names = providers.map(provider => capitalize(provider.name));
    return names;
  };

  const authenticateUser = useCallback(
    user => {
      dispatch(
        currentUserActions.login({ email: user.email, password: user.password })
      );
    },
    [dispatch]
  );

  const formatAttributes = data => ({ attributes: data });

  const onSuccess = useCallback(
    (response, data) => {
      authenticateUser(data);

      if (!willRedirect && !redirectToHomeOnSignup)
        handleViewChange("create-update");
      if (redirectToHomeOnSignup && !location?.state?.postLoginRedirect) {
        history.replace(location, {
          postLoginRedirect: "/"
        });
      }
    },
    [
      authenticateUser,
      handleViewChange,
      willRedirect,
      redirectToHomeOnSignup,
      history,
      location
    ]
  );

  const uid = useUID();

  return (
    <div ref={el => (focusRef.current = el)} tabIndex={-1}>
      <BaseHookForm
        apiMethod={usersAPI.create}
        formatData={formatAttributes}
        onSuccess={onSuccess}
        ariaLabelledBy={uid}
      >
        {errors => (
          <>
            <Styled.Header>
              {t("forms.signin_overlay.create_account")}
            </Styled.Header>
            <CreateFormFields errors={errors} />
            <Styled.Button
              type="submit"
              label={t("forms.signin_overlay.create_account")}
            />
          </>
        )}
      </BaseHookForm>
      {settings?.attributes?.oauth && (
        <>
          <Styled.LinksWrapper>
            {t("forms.signin_overlay.oauth_instructions", {
              appName: installationName,
              providers: OAuthProviderNames()
            })}
          </Styled.LinksWrapper>
          <OAuthOptions />
        </>
      )}
      <Styled.LinksWrapper>
        <Styled.ViewLink onClick={event => handleViewChange("login", event)}>
          {t("forms.signin_overlay.have_account")}
        </Styled.ViewLink>
      </Styled.LinksWrapper>
    </div>
  );
}
