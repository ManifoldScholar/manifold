import { useRef } from "react";
import PropTypes from "prop-types";
import { Redirect, useHistory } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Global as GlobalStyles } from "@emotion/react";
import has from "lodash/has";
import isEqual from "lodash/isEqual";
import config from "config";
import { notificationActions } from "actions";
import lh from "helpers/linkHandler";
import styles from "theme/styles/globalStyles";
import ApiTrace from "./ApiTrace";
import ClientTrace from "./ClientTrace";
import * as Styled from "./styles";

export default function FatalError(props) {
  const {
    fatalError: { error },
    headerLineOne,
    headerLineTwo,
    dismiss,
    redirectPath,
    dispatch
  } = props;

  const { t } = useTranslation();
  const history = useHistory();

  const prevError = useRef();

  if (!error) return null;

  /* I would like to hanlde this a better way but can't think of one that
     doesn't involve significant component reorganization. When a user hits
     renderProjectAuthorizationRedirect below when trying to access a reader route,
     the Manifold Container renders multiple times before the error is cleared from
     the redux store, which causes this component to hit that redirect multiple times
     and we loose the original route as the redirect path. Blocking render here when
     error is unchanged prevents the extra redirect.
  */
  if (isEqual(error, prevError.current)) return null;

  prevError.current = error;

  const defaultHeaders = {
    headerLineOne: t("errors.fatal.heading_line_one"),
    headerLineTwo: t("errors.fatal.heading_line_two")
  };

  const isAuthorizationError =
    error.method === "GET" && (error.status === 403 || error.status === 401);

  const isProjectAuthorizationError =
    isAuthorizationError && has(error, "project.id");

  const shouldRedirectToLogin =
    isAuthorizationError && !isProjectAuthorizationError;

  const renderProjectAuthorizationRedirect = () => {
    const url = lh.link("frontendProjectDetail", error.project.slug);
    if (dispatch) {
      dispatch(
        notificationActions.addNotification({
          id: "projectAuthorizationError",
          level: 2,
          heading: t("messages.project_authorization_warning.heading"),
          body: t("errors.authorization"),
          scope: "authentication"
        })
      );
    }

    return (
      <Redirect
        to={{
          pathname: url,
          state: {
            showLogin: true,
            postLoginRedirect: redirectPath,
            setIsRedirecting: true
          }
        }}
      />
    );
  };

  const renderLoginRedirect = () => {
    return (
      <Redirect
        to={{
          pathname: "/login",
          search: redirectPath ? `?redirect_uri=${redirectPath}` : undefined
        }}
      />
    );
  };

  /* Ensure we don't attempt to render router components outside the router context.
     Redirect to login when an error is caught in SSR and this component is rendered
     outside of the App Container is handled separately in entry-ssr.js.
  */
  if (history) {
    if (isProjectAuthorizationError)
      return renderProjectAuthorizationRedirect();
    if (shouldRedirectToLogin) return renderLoginRedirect();
  }

  return (
    <HelmetProvider>
      <Helmet title={`${error.status} Error: ${error.heading}`} />
      <GlobalStyles styles={styles} />
      <Styled.Body className="browse">
        <Styled.Wrapper>
          <Styled.Inner>
            <Styled.Container>
              <header>
                <Styled.Icon icon="stopSign64" size={52} />
                <Styled.Message>
                  {headerLineOne ?? defaultHeaders.headerLineOne}
                  {headerLineTwo !== null && (
                    <>
                      <br />
                      {headerLineTwo ?? defaultHeaders.headerLineTwo}
                    </>
                  )}
                </Styled.Message>
              </header>
              <div role="alert" aria-live="assertive" aria-atomic="true">
                {error ? (
                  <Styled.ErrorTitle>
                    {error.status} Error: {error.heading}
                  </Styled.ErrorTitle>
                ) : null}
                {config.environment.isDevelopment ? (
                  <Styled.ErrorBody>
                    {error.body}
                    {dismiss ? (
                      <span>
                        <br />
                        <Styled.Link
                          role="link"
                          onClick={dismiss}
                          className="dismiss"
                        >
                          {t("errors.fatal.dismiss_link")}
                        </Styled.Link>
                      </span>
                    ) : null}
                  </Styled.ErrorBody>
                ) : null}
              </div>
            </Styled.Container>
            {config.environment.isDevelopment ? (
              <div>
                {error.apiTrace ? <ApiTrace trace={error.apiTrace} /> : null}
                {error.clientTrace ? (
                  <ClientTrace
                    trace={error.clientTrace}
                    truncate={error.clientTraceTruncate}
                  />
                ) : null}
              </div>
            ) : null}
          </Styled.Inner>
        </Styled.Wrapper>
      </Styled.Body>
    </HelmetProvider>
  );
}

FatalError.propTypes = {
  fatalError: PropTypes.shape({
    error: PropTypes.object,
    type: PropTypes.string
  }).isRequired,
  headerLineOne: PropTypes.string,
  headerLineTwo: PropTypes.string,
  dismiss: PropTypes.func,
  redirectPath: PropTypes.string,
  dispatch: PropTypes.func
};
