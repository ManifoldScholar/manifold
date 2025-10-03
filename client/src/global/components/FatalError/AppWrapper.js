import { useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import has from "lodash/has";
import isEqual from "lodash/isEqual";
import lh from "helpers/linkHandler";
import { useCurrentUser, useNotification } from "hooks";
import FatalErrorRender from ".";

export default function FatalErrorAppWrapper(props) {
  const {
    fatalError: { error },
    redirectPath
  } = props;

  const { t } = useTranslation();
  const history = useHistory();
  const currentUser = useCurrentUser();

  const prevError = useRef();

  const loginNotification = useMemo(
    () => ({
      id: "authenticationError",
      level: 2,
      heading: t("errors.access_denied.header"),
      body: t("errors.access_denied.authentication"),
      scope: "authentication"
    }),
    [t]
  );

  const notifyLogin = useNotification(() => loginNotification);

  const unauthorizedNotification = useMemo(
    () => ({
      id: "authorizationError",
      level: 2,
      heading: t("errors.access_denied.header"),
      body: t("errors.access_denied.authorization")
    }),
    [t]
  );

  const notifyUnauthorized = useNotification(() => unauthorizedNotification);

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

  const isAuthorizationError =
    error.method === "GET" && (error.status === 403 || error.status === 401);

  const isProjectAuthError = isAuthorizationError && has(error, "project.id");

  const redirectToProject = () => {
    const routerState = currentUser?.id
      ? {}
      : {
          showLogin: true,
          postLoginRedirect: redirectPath
        };

    history.push({
      pathname: lh.link("frontendProjectDetail", error.project.slug),
      state: routerState
    });

    const notify = currentUser?.id
      ? setTimeout(notifyUnauthorized, 500)
      : notifyLogin;
    notify();
  };

  const redirectAndNotify = () => {
    if (!currentUser?.id) {
      return history.push({
        pathname: "/login",
        search: redirectPath ? `?redirect_uri=${redirectPath}` : undefined
      });
    }

    const pathKey = redirectPath ? redirectPath.split("/")?.[1] : null;
    const availableRedirects = [
      "projects/all",
      "backend/dashboard",
      "journals/all",
      "groups"
    ];
    const redirect = pathKey
      ? `/${availableRedirects.find(r => r.startsWith(pathKey))}`
      : "/";

    return history.push({
      pathname: redirect,
      search: "?notification=authorizationError"
    });
  };

  if (isProjectAuthError) return redirectToProject();
  if (isAuthorizationError) return redirectAndNotify();

  return <FatalErrorRender {...props} />;
}

FatalErrorAppWrapper.propTypes = {
  fatalError: PropTypes.shape({
    error: PropTypes.object,
    type: PropTypes.string
  }).isRequired,
  headerLineOne: PropTypes.string,
  headerLineTwo: PropTypes.string,
  dismiss: PropTypes.func,
  redirectPath: PropTypes.string
};
