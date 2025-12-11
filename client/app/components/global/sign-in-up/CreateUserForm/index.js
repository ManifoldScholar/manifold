import { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useFetcher, useRevalidator } from "react-router";
import { useAuthentication } from "hooks";
import { AppContext } from "app/contexts";
import CreateFormFields from "./CreateFormFields";
import Form from "components/global/form";
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
  const { currentUser } = useAuthentication();
  const { revalidate } = useRevalidator();
  const { pages } = useContext(AppContext);

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
    if (!fetcher.data?.success) return;
    if (fetcher.data.authToken) {
      cookie.write("authToken", fetcher.data.authToken);
    }
    revalidate();
  }, [fetcher.data, revalidate]);

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
