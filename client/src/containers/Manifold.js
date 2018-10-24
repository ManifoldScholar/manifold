import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import Helmet from "react-helmet";
import { SignInUp, FatalError, LoadingBar } from "components/global";
import config from "../config";
import has from "lodash/has";
import get from "lodash/get";
import { CSSTransitionGroup as ReactCSSTransitionGroup } from "react-transition-group";
import {
  uiVisibilityActions,
  routingActions,
  currentUserActions
} from "actions";
import { meAPI, settingsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { closest } from "utils/domUtils";
import ReactGA from "react-ga";
import Typekit from "react-typekit";
import { renderRoutes } from "react-router-config";
import getRoutes from "/routes";
import ch from "../helpers/consoleHelpers";
import FatalErrorBoundary from "../components/global/FatalError/Boundary";

const routes = getRoutes();
const { request } = entityStoreActions;
const { visibilityHide } = uiVisibilityActions;

class ManifoldContainer extends PureComponent {
  // This method will bootstrap data into manifold. Nothing else is loaded into the
  // store at this point, including params and the authenticated user.
  static bootstrap = (getState, dispatch, cookie) => {
    const promises = [];
    const state = getState();

    // Load settings if they have not already been loaded.
    const loaded = has(state, "entityStore.entities.settings.0");
    if (!loaded) {
      const settingsRequest = request(settingsAPI.show(), requests.settings, {
        oneTime: true
      });
      const settingsPromise = dispatch(settingsRequest).promise;
      settingsPromise.then(
        () => {
          ch.info("Settings loaded", "sparkles");
        },
        () => {
          ch.error("Settings failed to load", "rain_cloud");
        }
      );
      promises.push(settingsPromise);
    }

    // Authenticate from cookie.
    if (cookie && !state.authentication.authenticated) {
      const authToken = cookie.authToken;
      if (authToken) {
        const authPromise = dispatch(currentUserActions.login({ authToken }));
        authPromise.then(
          () => {
            ch.info("User authenticated", "sparkles");
          },
          () => {
            ch.info("Unable to authenticate user", "rain_cloud");
          }
        );
        promises.push(authPromise);
      }
    }

    return Promise.all(promises);
  };

  static mapStateToProps = state => {
    return {
      authentication: state.authentication,
      visibility: state.ui.transitory.visibility,
      loading: state.ui.transitory.loading.active,
      fatalError: state.fatalError,
      routing: state.routing,
      settings: select(requests.settings, state.entityStore)
    };
  };

  static propTypes = {
    dispatch: PropTypes.func,
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
      this.gaInitialized = true;
      if (this.props.gaInitCallback) this.props.gaInitCallback();
    }

    if (this.routeChanged(prevProps.location, this.props.location)) {
      this.props.dispatch(routingActions.update(this.props.location.state));
    }

    if (
      this.userJustLoggedOut(
        prevProps.authentication,
        this.props.authentication
      )
    )
      this.doPostLogout();
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

  doPostLogout() {
    this.redirectToHome();
  }

  redirectToHome() {
    this.props.history.push("/");
  }

  updateCurrentUser() {
    this.props.dispatch(
      request(meAPI.show(), requests.gAuthenticatedUserUpdate)
    );
  }

  handleGlobalClick = event => {
    if (!closest(event.target, ".panel-visible"))
      return this.props.dispatch(uiVisibilityActions.panelHideAll());
    if (event.target.classList.contains("drawer-overlay"))
      return this.props.dispatch(uiVisibilityActions.panelHideAll());
    return null;
  };

  headTitleProps(props) {
    let title = config.app.head.defaultTitle;
    if (get(props.settings, "attributes.general.headTitle")) {
      title = get(props.settings, "attributes.general.headTitle");
    }

    return {
      titleTemplate: `${title} | %s`,
      defaultTitle: title
    };
  }

  renderTypekit() {
    const tkId = get(this.props.settings, "attributes.theme.typekitId");
    const tkEnabled = !!tkId;
    if (!tkEnabled) return null;
    return <Typekit kitId={tkId} />;
  }

  render() {
    const fatalError = this.props.fatalError;
    const hideSignInUpOverlay = bindActionCreators(
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
        {this.renderTypekit()}
        {this.props.confirm}
        <Helmet {...config.app.head} {...this.headTitleProps(this.props)} />
        <LoadingBar loading={this.props.loading} />
        <ReactCSSTransitionGroup
          transitionName={"overlay-login"}
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {this.props.visibility.signInUpOverlay ? (
            <SignInUp.Overlay
              key="signInUpOverlay"
              hideSignInUpOverlay={hideSignInUpOverlay}
              authentication={this.props.authentication}
              settings={this.props.settings}
              dispatch={this.props.dispatch}
              hash={get(this, "props.routing.locationBeforeTransitions.hash")}
            />
          ) : null}
        </ReactCSSTransitionGroup>
        {fatalError.error ? (
          <div className="global-container">
            <FatalError fatalError={fatalError} />
          </div>
        ) : (
          <FatalErrorBoundary>{renderRoutes(routes)}</FatalErrorBoundary>
        )}
      </div>
    );
  }
}

const Manifold = withRouter(
  connect(ManifoldContainer.mapStateToProps)(ManifoldContainer)
);

export default Manifold;
