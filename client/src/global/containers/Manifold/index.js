import { useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ColorScheme from "global/components/ColorScheme";
import LoadingBar from "global/components/LoadingBar";
import AppFatalError from "global/components/FatalError/AppWrapper";
import SignInUp from "global/components/sign-in-up";
import get from "lodash/get";
import {
  uiVisibilityActions,
  routingActions,
  notificationActions
} from "actions";
import { meAPI, requests } from "api";
import { loaded } from "utils/entityUtils";
import { Outlet } from "react-router-dom";
import FatalErrorBoundary from "global/components/FatalError/Boundary";
import { FrontendModeContext } from "helpers/contexts";
import { entityStoreActions } from "actions";
import CookiesBanner from "global/components/CookiesBanner";
import Utility from "global/components/utility";
import Analytics from "hoc/analytics";
import { Helmet } from "react-helmet-async";
import { useFromStore } from "hooks";
import { NavigationBlockerProvider } from "global/components/router/NavigationBlockerContext";
import notifications from "./notifications";

const { request } = entityStoreActions;
const { visibilityHide } = uiVisibilityActions;

export default function ManifoldContainer({ confirm }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const authentication = useFromStore({ path: "authentication" });
  const visibility = useFromStore({ path: "ui.transitory.visibility" });
  const frontendMode = useFromStore({ path: "ui.transitory.frontendMode" });
  const loading = useFromStore({ path: "ui.transitory.loading.active" });
  const fatalError = useFromStore({ path: "fatalError" });
  const settings = useFromStore({
    requestKey: requests.settings,
    action: "select"
  });
  const readingGroupsLoaded = useSelector(state =>
    loaded(requests.feMyReadingGroups, state.entityStore)
  );

  const prevLocationRef = useRef(location);
  const prevAuthRef = useRef(authentication);
  const isFirstMountRef = useRef(true);

  const routeStateRequestsLogin = Boolean(location.state?.showLogin);
  const routeStateRequestsPostLoginRedirect = Boolean(
    location.state?.postLoginRedirect
  );

  const searchParams = location.search
    ? new URLSearchParams(location.search)
    : null;
  const routeNotificationParam = searchParams?.get("notification") ?? null;
  const routeRedirectUriParam = searchParams?.get("redirect_uri") ?? null;

  const maybeShowLogin = useCallback(() => {
    dispatch(uiVisibilityActions.visibilityShow("signInUpOverlay"));
  }, [dispatch]);

  const maybeFetchReadingGroups = useCallback(() => {
    const { authenticated } = authentication;
    if (!authenticated) return;
    if (!settings) return;
    if (readingGroupsLoaded) return;
    if (settings?.attributes?.general?.disableReadingGroups !== false) return;

    dispatch(request(meAPI.readingGroups(), requests.feMyReadingGroups));
  }, [authentication, readingGroupsLoaded, settings, dispatch]);

  const dispatchRouteUpdate = useCallback(() => {
    dispatch(routingActions.update(location.state));
  }, [dispatch, location.state]);

  const doNotify = useCallback(() => {
    const key = Object.keys(notifications).find(
      n => notifications[n].id === routeNotificationParam
    );
    let notification = key ? notifications[key] : null;
    if (!notification) return;

    if (location.state?.notificationBody)
      notification = {
        ...notification,
        body: location.state.notificationBody
      };

    dispatch(notificationActions.addNotification(notification));
  }, [routeNotificationParam, location.state, dispatch]);

  const doPostLogout = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const doPostLogin = useCallback(() => {
    maybeFetchReadingGroups();
    if (routeStateRequestsPostLoginRedirect) {
      dispatch(notificationActions.removeAllNotifications());
      navigate(location.state.postLoginRedirect);
    } else if (routeRedirectUriParam) {
      dispatch(notificationActions.removeAllNotifications());
      navigate(routeRedirectUriParam);
    }
  }, [
    maybeFetchReadingGroups,
    routeStateRequestsPostLoginRedirect,
    routeRedirectUriParam,
    location.state,
    dispatch,
    navigate
  ]);

  const typekitId = get(settings, "attributes.theme.typekitId");
  const renderTypekit = typekitId ? (
    <Helmet>
      <link rel="preconnect" href="https://use.typekit.net" crossOrigin="" />
      <link rel="preconnect" href="https://p.typekit.net" crossOrigin="" />
      <link
        rel="stylesheet"
        href={`https://use.typekit.net/${typekitId}.css`}
      />
    </Helmet>
  ) : null;

  const hideOverlay = useCallback(() => {
    dispatch(visibilityHide("signInUpOverlay"));
  }, [dispatch]);

  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      maybeFetchReadingGroups();
      if (routeNotificationParam) doNotify();
    }
  }, [maybeFetchReadingGroups, routeNotificationParam, doNotify]);

  useEffect(() => {
    const prevLocation = prevLocationRef.current;
    if (prevLocation.pathname !== location.pathname) {
      const activeEl = document.activeElement;
      if (activeEl) activeEl.blur();
      dispatchRouteUpdate();
      if (routeStateRequestsLogin) maybeShowLogin();
      if (routeNotificationParam) doNotify();
    }
    prevLocationRef.current = location;
  }, [
    location,
    dispatchRouteUpdate,
    routeStateRequestsLogin,
    routeNotificationParam,
    maybeShowLogin,
    doNotify
  ]);

  useEffect(() => {
    const prevAuth = prevAuthRef.current;
    if (
      authentication.authenticated === false &&
      prevAuth.authenticated === true
    ) {
      doPostLogout();
    }
    if (
      authentication.authenticated === true &&
      prevAuth.authenticated === false
    ) {
      doPostLogin();
    }
    prevAuthRef.current = authentication;
  }, [authentication, doPostLogout, doPostLogin]);

  return (
    <Analytics>
      <div role="presentation" className="global-container">
        <Utility.SkipLink />
        <div id="global-notification-container" />
        <div id="global-overlay-container" />
        <FrontendModeContext.Provider value={frontendMode || {}}>
          <NavigationBlockerProvider>
            {renderTypekit}
            {confirm}
            <LoadingBar loading={loading} />
            <ColorScheme settings={settings} />
            <SignInUp.Overlay
              active={visibility.signInUpOverlay}
              hideOverlay={hideOverlay}
            />
            {fatalError.error && fatalError.error.status !== 403 ? (
              <div className="global-container">
                <AppFatalError
                  fatalError={fatalError}
                  redirectPath={location.pathname}
                />
              </div>
            ) : (
              <FatalErrorBoundary>
                <Outlet />
              </FatalErrorBoundary>
            )}
            <CookiesBanner />
          </NavigationBlockerProvider>
        </FrontendModeContext.Provider>
      </div>
    </Analytics>
  );
}

ManifoldContainer.displayName = "Manifold.Container";

ManifoldContainer.propTypes = {
  confirm: PropTypes.element
};
