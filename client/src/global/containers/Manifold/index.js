import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import ColorScheme from "global/components/ColorScheme";
import LoadingBar from "global/components/LoadingBar";
import AppFatalError from "global/components/FatalError/AppWrapper";
import SignInUp from "global/components/sign-in-up";
import has from "lodash/has";
import get from "lodash/get";
import {
  uiVisibilityActions,
  routingActions,
  notificationActions
} from "actions";
import { meAPI, requests } from "api";
import { select, loaded } from "utils/entityUtils";
import { renderRoutes } from "react-router-config";
import getRoutes from "routes";
import FatalErrorBoundary from "global/components/FatalError/Boundary";
import { FrontendModeContext } from "helpers/contexts";
import { entityStoreActions } from "actions";
import CookiesBanner from "global/components/CookiesBanner";
import Utility from "global/components/utility";
import { Helmet } from "react-helmet-async";
import notifications from "./notifications";

const { request } = entityStoreActions;
const routes = getRoutes();
const { visibilityHide } = uiVisibilityActions;

class ManifoldContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      authentication: state.authentication,
      visibility: state.ui.transitory.visibility,
      frontendMode: state.ui.transitory.frontendMode,
      language: state.ui.persistent.locale.language,
      loading: state.ui.transitory.loading.active,
      fatalError: state.fatalError,
      routing: state.routing,
      settings: select(requests.settings, state.entityStore),
      readingGroups: select(requests.feMyReadingGroups, state.entityStore),
      readingGroupsLoaded: loaded(requests.feMyReadingGroups, state.entityStore)
    };
  };

  static propTypes = {
    dispatch: PropTypes.func,
    language: PropTypes.string,
    loading: PropTypes.bool,
    visibility: PropTypes.object,
    authentication: PropTypes.object,
    fatalError: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
    settings: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object,
    confirm: PropTypes.element,
    gaInitCallback: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.gaInitialized = false;
  }

  componentDidUpdate(prevProps, prevStateIgnored) {
    if (this.routeChanged(prevProps.location, this.props.location)) {
      const activeEl = document.activeElement;
      if (activeEl) activeEl.blur();
      this.dispatchRouteUpdate();
      if (this.routeStateRequestsLogin) this.maybeShowLogin();
      if (this.routeNotificationParam) this.doNotify();
    }

    if (
      this.userJustLoggedOut(
        prevProps.authentication,
        this.props.authentication
      )
    )
      this.doPostLogout();

    if (
      this.userJustLoggedIn(prevProps.authentication, this.props.authentication)
    )
      this.doPostLogin();
  }

  componentDidMount() {
    this.maybeFetchReadingGroups();
    if (this.routeNotificationParam) this.doNotify();
  }

  get routeStateRequestsLogin() {
    if (this.props.location.state)
      return Boolean(this.props.location.state.showLogin);
  }

  get routeStateRequestsPostLoginRedirect() {
    if (this.props.location.state)
      return Boolean(this.props.location.state.postLoginRedirect);
  }

  get routeNotificationParam() {
    if (this.props.location.search) {
      const searchParams = new URLSearchParams(this.props.location?.search);
      const notificationId = searchParams.get("notification");
      return notificationId;
    }
  }

  get routeRedirectUriParam() {
    if (this.props.location.search) {
      const searchParams = new URLSearchParams(this.props.location?.search);
      const redirectUri = searchParams.get("redirect_uri");
      return redirectUri;
    }
  }

  maybeShowLogin() {
    this.props.dispatch(uiVisibilityActions.visibilityShow("signInUpOverlay"));
  }

  maybeFetchReadingGroups() {
    const {
      authentication,
      readingGroupsLoaded,
      settings,
      dispatch
    } = this.props;
    const { authenticated } = authentication;
    if (!authenticated) return;
    if (!settings) return;
    if (readingGroupsLoaded) return;
    if (settings?.attributes?.general?.disableReadingGroups !== false) return;

    dispatch(request(meAPI.readingGroups(), requests.feMyReadingGroups));
  }

  dispatchRouteUpdate() {
    this.props.dispatch(routingActions.update(this.props.location.state));
  }

  doNotify() {
    const key = Object.keys(notifications).find(
      n => notifications[n].id === this.routeNotificationParam
    );
    let notification = key ? notifications[key] : null;
    if (!notification) return;

    if (this.props.location.state?.notificationBody)
      notification = {
        ...notification,
        body: this.props.location.state.notificationBody
      };

    this.props.dispatch(notificationActions.addNotification(notification));
  }

  routeChanged(prevLocation, location) {
    return prevLocation.pathname !== location.pathname;
  }

  receivedGaTrackingId(settings) {
    const path = "attributes.integrations.gaFourTrackingId";
    return has(settings, path) && get(settings, path) !== "";
  }

  userJustLoggedOut(prevAuth, auth) {
    return auth.authenticated === false && prevAuth.authenticated === true;
  }

  userJustLoggedIn(prevAuth, auth) {
    return auth.authenticated === true && prevAuth.authenticated === false;
  }

  doPostLogout() {
    this.reload();
  }

  doPostLogin() {
    this.maybeFetchReadingGroups();
    if (this.routeStateRequestsPostLoginRedirect) {
      this.props.dispatch(notificationActions.removeAllNotifications());
      this.props.history.push(this.props.location.state.postLoginRedirect);
    } else if (this.routeRedirectUriParam) {
      this.props.dispatch(notificationActions.removeAllNotifications());
      this.props.history.push(this.routeRedirectUriParam);
    }
  }

  reload() {
    this.redirectToHome();
  }

  redirectToHome() {
    this.props.history.push("/");
  }

  renderTypekit() {
    const tkId = get(this.props.settings, "attributes.theme.typekitId");
    const tkEnabled = !!tkId;
    if (!tkEnabled) return null;
    return (
      <Helmet>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="" />
        <link rel="stylesheet" href={`https://use.typekit.net/${tkId}.css`} />
      </Helmet>
    );
  }

  render() {
    const fatalError = this.props.fatalError;

    const hideOverlay = bindActionCreators(
      () => visibilityHide("signInUpOverlay"),
      this.props.dispatch
    );

    return (
      <div role="presentation" className="global-container">
        <Utility.SkipLink />
        <div id="global-notification-container" />
        <div id="global-overlay-container" />
        <FrontendModeContext.Provider value={this.props.frontendMode}>
          {this.renderTypekit()}
          {this.props.confirm}
          <LoadingBar loading={this.props.loading} />
          <ColorScheme settings={this.props.settings} />
          <SignInUp.Overlay
            active={this.props.visibility.signInUpOverlay}
            hideOverlay={hideOverlay}
          />
          {/* Allow 403's through, so we can render the appropriate header/footer with the error message. We now catch these in the Frontend/Backend/Reader containers. */}
          {fatalError.error && fatalError.error.status !== 403 ? (
            <div className="global-container">
              <AppFatalError
                fatalError={fatalError}
                redirectPath={this.props.location.pathname}
              />
            </div>
          ) : (
            <FatalErrorBoundary location={this.props.location}>
              {renderRoutes(routes)}
            </FatalErrorBoundary>
          )}
          <CookiesBanner />
        </FrontendModeContext.Provider>
      </div>
    );
  }
}

const Manifold = withRouter(
  connect(ManifoldContainer.mapStateToProps)(ManifoldContainer)
);

export default Manifold;
