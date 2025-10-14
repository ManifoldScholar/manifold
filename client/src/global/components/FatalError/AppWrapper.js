import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import has from "lodash/has";
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
      ? () => setTimeout(notifyUnauthorized, 500)
      : notifyLogin;
    notify();
  };

  const redirectOrNotify = () => {
    if (!currentUser?.id) {
      return history.push({
        pathname: "/login",
        search: redirectPath ? `?redirect_uri=${redirectPath}` : undefined
      });
    }

    return (
      <FatalErrorRender
        headerLineOne={t("errors.access_denied.header")}
        headerLineTwo=""
        contained
        {...props}
      />
    );
  };

  if (isProjectAuthError) return redirectToProject();
  if (isAuthorizationError) return redirectOrNotify();

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
