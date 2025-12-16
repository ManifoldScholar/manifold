import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { tokensAPI } from "api";
import { useCurrentUser, usePages, useRevalidate } from "hooks";
import CreateFormFields from "./CreateFormFields";
import Form from "global/components/form";
import { useNavigate, useLocation } from "react-router";
import BrowserCookieHelper from "helpers/cookie/Browser";
import * as SharedStyles from "../styles";

const cookie = new BrowserCookieHelper();

export default function CreateUserForm({
  handleViewChange,
  willRedirect,
  redirectToHomeOnSignup
}) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useCurrentUser();
  const revalidate = useRevalidate();
  const pages = usePages();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const termsPage = pages?.find(
    p => p.attributes.purpose === "terms_and_conditions"
  );

  const formatData = data => {
    const { attributes } = data;
    return {
      attributes: termsPage
        ? {
            ...attributes,
            termsAndConditionsAcceptedAt: new Date().toISOString()
          }
        : attributes
    };
  };

  useEffect(() => {
    if (
      fetcher.data?.success &&
      fetcher.data?.email &&
      fetcher.data?.password
    ) {
      const authenticateUser = async () => {
        setIsAuthenticating(true);
        try {
          const response = await tokensAPI.createToken(
            fetcher.data.email,
            fetcher.data.password
          );
          const authToken = response?.meta?.authToken;
          if (authToken) {
            cookie.write("authToken", authToken);
            revalidate();
          }
        } catch {
          // If login fails after account creation, still trigger revalidation
          // The user account was created successfully
          revalidate();
        } finally {
          setIsAuthenticating(false);
        }
      };
      authenticateUser();
    }
  }, [fetcher.data, revalidate]);

  useEffect(() => {
    if (currentUser && !isAuthenticating) {
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
    location,
    isAuthenticating
  ]);

  return (
    <>
      <SharedStyles.Form
        fetcher={fetcher}
        action="/actions/signup"
        formatData={formatData}
      >
        <Form.Header
          label={t("forms.signin_overlay.create_account")}
          styleType="primary"
        />
        <CreateFormFields />
        <Form.InputError
          errors={
            fetcher.data?.errors && fetcher.state !== "loading"
              ? fetcher.data.errors
              : []
          }
        />
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
