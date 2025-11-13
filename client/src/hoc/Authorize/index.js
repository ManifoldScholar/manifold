import { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import isPlainObject from "lodash/isPlainObject";
import { Navigate, useLocation } from "react-router-dom";
import { notificationActions } from "actions";
import Authorization from "helpers/authorization";
import FatalErrorRender from "global/components/FatalError";
import get from "lodash/get";
import { useFromStore } from "hooks";

export default function Authorize(props) {
  const {
    successBehavior = "show",
    failureRedirect = null,
    failureNotification = null,
    children
  } = props;

  const dispatch = useDispatch();
  const location = useLocation();
  const authentication = useFromStore({ path: "authentication" });
  const propsWithAuth = { ...props, authentication };

  const authorization = useMemo(() => new Authorization(), []);

  const isAuthenticated = get(authentication, "authenticated");

  const getRedirectPath = useCallback(
    redirectProp => {
      if (redirectProp === true) {
        const pathKey = location.pathname.split("/")?.[1];
        const availableRedirects = [
          "projects/all",
          "backend/dashboard",
          "journals/all",
          "groups"
        ];
        return pathKey
          ? `/${availableRedirects.find(r => r.startsWith(pathKey))}`
          : "/";
      }

      if (typeof redirectProp === "string") return redirectProp;

      return null;
    },
    [location.pathname]
  );

  const renderAccessDenied = useCallback(() => {
    const fatalError = {
      error: {
        status: 403,
        method: "GET",
        heading: "Access Denied"
      }
    };

    const hasAnyAdminAccess = authorization.authorizeKind({
      authentication,
      kind: [
        "admin",
        "editor",
        "marketeer",
        "project_creator",
        "project_editor",
        "project_property_manager",
        "journal_editor"
      ]
    });

    return (
      <FatalErrorRender
        fatalError={fatalError}
        headerLineOne="errors.access_denied.header"
        headerLineTwo=""
        userMessage={
          failureNotification?.body ??
          (!hasAnyAdminAccess
            ? "errors.access_denied.no_admin_access"
            : "errors.access_denied.authorization_admin")
        }
        contained
        hideStatus
      />
    );
  }, [authentication, authorization, failureNotification?.body]);

  const doNotify = useCallback(
    failureNotificationParam => {
      let error = {
        heading: "Access Denied.",
        body:
          "Please login to proceed. After logging in, you will be automatically redirected.",
        level: 2,
        scope: "authentication"
      };
      if (isPlainObject(failureNotificationParam)) {
        error = Object.assign(error, failureNotificationParam);
      }
      dispatch(notificationActions.addNotification(error));
    },
    [dispatch]
  );

  const redirectAndNotify = useCallback(
    ({ redirectPath, postLoginUri, notificationContent }) => {
      const showLoginOverlay = redirectPath !== "/login";
      if (showLoginOverlay) doNotify(notificationContent);

      return (
        <Navigate
          to={redirectPath}
          search={
            !showLoginOverlay ? `?redirect_uri=${postLoginUri}` : undefined
          }
          state={{
            showLogin: showLoginOverlay,
            postLoginRedirect: postLoginUri,
            notificationBody: notificationContent?.body
          }}
        />
      );
    },
    [doNotify]
  );

  const maybeRedirect = () => {
    if (isAuthenticated) return renderAccessDenied();

    const redirectPath = getRedirectPath(failureRedirect);
    const postLoginUri = `${location.pathname}${location.search}`;

    if (redirectPath) {
      // For SSR, throw a Response object for redirect
      if (__SERVER__) {
        const redirectUrl = `/login?redirect_uri=${encodeURIComponent(
          postLoginUri
        )}`;

        throw new Response(null, {
          status: 302,
          headers: { Location: redirectUrl }
        });
      }

      return redirectAndNotify({
        redirectPath,
        postLoginUri,
        notificationContent: failureNotification
      });
    }
  };

  const renderHide = () => {
    if (authorization.authorize(propsWithAuth)) return null;
    return <>{children}</>;
  };

  const renderShow = () => {
    if (!authorization.authorize(propsWithAuth)) return null;
    return <>{children}</>;
  };

  const isAuthorized = authorization.authorize(propsWithAuth);
  if (!isAuthorized && failureRedirect) return maybeRedirect();

  if (!children) return null;

  if (successBehavior === "hide") return renderHide();
  if (successBehavior === "show") return renderShow();

  return null;
}

Authorize.displayName = "Authorize";

Authorize.propTypes = {
  entity: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.array
  ]),
  ability: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  kind: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  successBehavior: PropTypes.oneOf(["hide", "show"]),
  failureRedirect: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  failureNotification: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      heading: PropTypes.string,
      body: PropTypes.string,
      level: PropTypes.number
    })
  ]),
  children: PropTypes.node
};
