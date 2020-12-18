import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactGA from "react-ga";
import withSettings from "hoc/with-settings";
import { withRouter } from "react-router-dom";
import get from "lodash/get";
import config from "config";
import ch from "helpers/consoleHelpers";
import { EventAnalyticsContext, FrontendModeContext } from "helpers/contexts";

const GOOGLE_ANALYTICS = "GOOGLE_ANALYTICS";
const MANIFOLD_ANALYTICS = "MANIFOLD_ANALYTICS";

class Analytics extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    settings: PropTypes.object,
    authToken: PropTypes.string,
    children: PropTypes.element.isRequired
  };

  constructor(props) {
    super(props);
    this.eventQueue = [];
    this.state = {
      initialized: {
        [GOOGLE_ANALYTICS]: false,
        [MANIFOLD_ANALYTICS]: false
      },
      services: {
        ahoy: null
      }
    };
  }

  componentDidMount() {
    this.initializeGoogleAnalytics();
    this.initializeManifoldAnalytics();
  }

  componentDidUpdate(prevProps) {
    if (this.routeChanged(prevProps.location, this.props.location)) {
      this.trackViewInGoogleAnalytics(this.props);
    }
  }

  isInitialized(key) {
    if (__SERVER__) return;
    return this.state.initialized[key] === true;
  }

  canInitialize(key) {
    if (__SERVER__) return false;
    if (key === GOOGLE_ANALYTICS && !this.gaId) return false;
    if (key === MANIFOLD_ANALYTICS && this.state.services[MANIFOLD_ANALYTICS])
      return false;
    return !this.isInitialized(key);
  }

  routeChanged(prevLocation, location) {
    return prevLocation.pathname !== location.pathname;
  }

  trackViewInGoogleAnalytics(props) {
    if (!this.isInitialized(GOOGLE_ANALYTICS)) return;
    ReactGA.ga("send", "pageview", props.location.pathname);
  }

  get gaId() {
    return get(this.props.settings, "attributes.integrations.gaTrackingId");
  }

  logInit(name) {
    this.log(`${name} initialized`);
  }

  log(msg) {
    if (config.environment.isDevelopment) {
      ch.notice(msg, "chart_with_upwards_trend");
    }
  }

  setStateInitialized(key) {
    const initialized = { ...this.state.initialized, [key]: true };
    this.setState({ initialized });
  }

  initializeManifoldAnalytics() {
    // if (!this.canInitialize(MANIFOLD_ANALYTICS)) return;
    // const initialized = {
    //   ...this.state.initialized,
    //   [MANIFOLD_ANALYTICS]: true
    // };
    // const services = {
    //   ...this.state.services,
    //   [MANIFOLD_ANALYTICS]: ahoy
    // };
    // this.setState({ initialized, services }, () => {
    //   this.logInit("Event Analytics");
    //   this.flushEventQueue();
    // });
  }

  initializeGoogleAnalytics() {
    if (!this.canInitialize(GOOGLE_ANALYTICS)) return;
    if (!this.gaId) return;
    ReactGA.initialize(this.gaId);
    this.logInit("Google Analytics");
    this.setStateInitialized(GOOGLE_ANALYTICS);
  }

  flushEventQueue() {
    const length = this.eventQueue.length;
    this.log(
      `Flushing ${length} ${
        length === 1 ? "item" : "items"
      } from the event tracking queue.`
    );
    while (this.eventQueue.length) {
      const { name, properties } = this.eventQueue.shift();
      this.performTrackEvent(name, properties);
    }
  }

  queueEvent(name, properties) {
    // ``;
    // this.log(`Queuing event: ${name.toString()}`);
    // this.eventQueue.push({ name, properties });
  }

  performTrackEvent(name, properties) {
    // this.log(`Tracking event: ${name.toString()}`);
    // this.state.services[MANIFOLD_ANALYTICS].track(name, properties);
  }

  trackEvent = (name, properties) => {
    // if (!this.isInitialized(MANIFOLD_ANALYTICS)) {
    //   this.queueEvent(name, properties);
    // } else {
    //   this.performTrackEvent(name, properties);
    // }
  };

  render() {
    return (
      <EventAnalyticsContext.Provider value={{ track: this.trackEvent }}>
        {this.props.children}
      </EventAnalyticsContext.Provider>
    );
  }
}

export default withRouter(withSettings(Analytics));
