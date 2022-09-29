import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import HeadContent from "global/components/HeadContent";
import ColorScheme from "global/components/ColorScheme";
import LoadingBar from "global/components/LoadingBar";
import FatalError from "global/components/FatalError";
import SignInUp from "global/components/sign-in-up";
import has from "lodash/has";
import get from "lodash/get";
import { CSSTransition } from "react-transition-group";
import {
  uiVisibilityActions,
  routingActions,
  notificationActions
} from "actions";
import { meAPI, requests } from "api";
import { select, loaded } from "utils/entityUtils";
import { closest } from "utils/domUtils";
import ReactGA from "react-ga4";
import Typekit from "react-typekit";
import { renderRoutes } from "react-router-config";
import getRoutes from "routes";
import FatalErrorBoundary from "global/components/FatalError/Boundary";
import { FrontendModeContext } from "helpers/contexts";
import { entityStoreActions } from "actions";
import CookieHelper from "helpers/cookie/Browser";

const cookie = new CookieHelper();
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
    if (this.receivedGaTrackingId(this.props.settings) && !this.gaInitialized) {
      ReactGA.initialize(
        this.props.settings.attributes.integrations.gaTrackingId
      );

      const auth = this.props.authentication;
      const anonConsent = cookie.read("anonAnalyticsConsent");
      const consentGoogleAnalytics =
        (auth.authenticated && !!auth.currentUser.consentGoogleAnalytics) ||
        (!auth.authenticated && !!anonConsent.consentGoogleAnalytics);

      if (!consentGoogleAnalytics) {
        ReactGA.gtag("consent", "default", {
          analytics_storage: "denied"
        });
      }

      this.gaInitialized = true;
      if (this.props.gaInitCallback) this.props.gaInitCallback();
    }

    if (this.routeChanged(prevProps.location, this.props.location)) {
      this.dispatchRouteUpdate();
      if (this.routeStateRequestsLogin) this.maybeShowLogin();
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
  }

  get routeStateRequestsLogin() {
    if (this.props.location.state)
      return Boolean(this.props.location.state.showLogin);
  }

  get routeStateRequestsPostLoginRedirect() {
    if (this.props.location.state)
      return Boolean(this.props.location.state.postLoginRedirect);
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

  routeChanged(prevLocation, location) {
    return prevLocation.pathname !== location.pathname;
  }

  receivedGaTrackingId(settings) {
    const path = "attributes.integrations.gaTrackingId";
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
    }
  }

  reload() {
    this.redirectToHome();
  }

  redirectToHome() {
    this.props.history.push("/");
  }

  handleGlobalClick = event => {
    if (!closest(event.target, ".panel-visible"))
      return this.props.dispatch(uiVisibilityActions.panelHideAll());
    if (event.target.classList.contains("drawer-overlay"))
      return this.props.dispatch(uiVisibilityActions.panelHideAll());
    return null;
  };

  renderTypekit() {
    const tkId = get(this.props.settings, "attributes.theme.typekitId");
    const tkEnabled = !!tkId;
    if (!tkEnabled) return null;
    return <Typekit kitId={tkId} />;
  }

  render() {
    const fatalError = this.props.fatalError;

    const hideOverlay = bindActionCreators(
      () => visibilityHide("signInUpOverlay"),
      this.props.dispatch
    );

    return (
      <div
        onClick={this.handleGlobalClick}
        role="presentation"
        className="global-container"
      >
        <div id="global-notification-container" />
        <div id="global-overlay-container" />
        <FrontendModeContext.Provider value={this.props.frontendMode}>
          {this.renderTypekit()}
          {this.props.confirm}
          <HeadContent />
          <LoadingBar loading={this.props.loading} />
          <ColorScheme settings={this.props.settings} />
          <CSSTransition
            in={this.props.visibility.signInUpOverlay}
            classNames="overlay-login"
            timeout={{ enter: 300, exit: 300 }}
            unmountOnExit
          >
            <SignInUp.Overlay
              key="signInUpOverlay"
              hideOverlay={hideOverlay}
              hash={get(this, "props.routing.locationBeforeTransitions.hash")}
            />
          </CSSTransition>
          {fatalError.error ? (
            <div className="global-container">
              <FatalError
                dispatch={this.props.dispatch}
                fatalError={fatalError}
              />
            </div>
          ) : (
            <FatalErrorBoundary>{renderRoutes(routes)}</FatalErrorBoundary>
          )}
        </FrontendModeContext.Provider>
      </div>
    );
  }
}

const Manifold = withRouter(
  connect(ManifoldContainer.mapStateToProps)(ManifoldContainer)
);

export default Manifold;
