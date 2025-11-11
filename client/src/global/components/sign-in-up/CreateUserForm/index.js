import React, { useRef, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { usersAPI, requests } from "api";
import { currentUserActions } from "actions";
import { useFromStore } from "hooks";
import CreateFormFields from "./CreateFormFields";
import Form from "global/components/form";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import * as SharedStyles from "../styles";

export default function CreateUserForm({
  handleViewChange,
  willRedirect,
  redirectToHomeOnSignup
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authentication = useFromStore({ path: "authentication" });
  const { currentUser } = authentication ?? {};

  const emailRef = useRef();
  const passwordRef = useRef();

  const authenticateUser = useCallback(
    (email, password) => {
      dispatch(currentUserActions.login({ email, password }));
    },
    [dispatch]
  );

  const pages = useFromStore({ requestKey: requests.gPages, action: "select" });
  const termsPage = pages?.find(
    p => p.attributes.purpose === "terms_and_conditions"
  );

  const formatAttributes = data => {
    const { attributes } = data;
    emailRef.current = attributes?.email;
    passwordRef.current = attributes?.password;

    return {
      attributes: termsPage
        ? {
            ...attributes,
            termsAndConditionsAcceptedAt: new Date().toISOString()
          }
        : attributes
    };
  };

  const onSuccess = useCallback(() => {
    authenticateUser(emailRef.current, passwordRef.current);
  }, [authenticateUser]);

  useEffect(() => {
    if (currentUser) {
      if (!willRedirect && !redirectToHomeOnSignup)
        handleViewChange("create-update");
      if (redirectToHomeOnSignup && !location?.state?.postLoginRedirect) {
        navigate(location, {
          postLoginRedirect: "/",
          replace: true
        });
      }
    }
  }, [
    currentUser,
    handleViewChange,
    willRedirect,
    redirectToHomeOnSignup,
    navigate,
    location
  ]);

  return (
    <>
      <SharedStyles.Form
        name="global-create-user"
        create={usersAPI.create}
        formatData={formatAttributes}
        onSuccess={onSuccess}
      >
        <Form.Header
          label={t("forms.signin_overlay.create_account")}
          styleType="primary"
        />
        <CreateFormFields />
        <input
          className="button-secondary"
          type="submit"
          value={t("forms.signin_overlay.create_account")}
        />
      </SharedStyles.Form>
      <SharedStyles.LinksWrapper>
        <SharedStyles.ViewLink
          onClick={event => handleViewChange("login", event)}
        >
          {t("forms.signin_overlay.have_account")}
        </SharedStyles.ViewLink>
      </SharedStyles.LinksWrapper>
    </>
  );
}

CreateUserForm.displayName = "Global.SignInUp.CreateUserForm";

CreateUserForm.propTypes = {
  handleViewChange: PropTypes.func,
  willRedirect: PropTypes.bool,
  redirectToHomeOnSignup: PropTypes.bool
};
