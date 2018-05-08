import { Component } from "react";
import PropTypes from "prop-types";
import ReactGA from "react-ga";
import withSettings from "containers/global/HigherOrder/withSettings";
import { withRouter } from "react-router-dom";
import get from "lodash/get";

class Analytics extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    settings: PropTypes.object,
    children: PropTypes.element.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      initialized: false
    };
    this.lock = false;
  }

  componentDidMount() {
    this.initialize(this.props);
  }

  componentDidUpdate(prevProps) {
    this.initialize(this.props);
    if (this.props.location.key !== prevProps.location.key) {
      this.trackRouteUpdate(this.props);
    }
  }

  trackRouteUpdate(props) {
    if (__SERVER__) return;
    if (!this.state.initialized) return;
    ReactGA.ga("send", "pageview", props.location.pathname);
    // this.logTrack(props);
  }

  gaid(propsIgnored) {
    return get(this.props.settings, "attributes.integrations.gaTrackingId");
  }

  logInit(propsIgnored) {
    if (process.env.NODE_ENV === "development" && __CLIENT__) {
      console.log(`📈 Analytics: Initialized`); // eslint-disable-line no-console
    }
  }

  logTrack(props) {
    if (process.env.NODE_ENV === "development" && __CLIENT__) {
      console.log(`📉 Analytics: page view for ${props.location.pathname}`); // eslint-disable-line no-console
    }
  }

  initialize(props) {
    if (this.state.initialized === true) return;
    const id = this.gaid(props);
    if (!id) return;
    if (this.lock) return;
    ReactGA.initialize(id);
    this.lock = true;
    this.logInit(props);
    this.setState({ initialized: true }, () => {
      this.lock = false;
    });
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(withSettings(Analytics));
