import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { oauthActions } from "actions";
import { get, isArray } from "lodash";
import { isOauthEvent } from "utils/oauth";

function mapStateToProps({ oauth }) {
  return { oauth };
}

const MONITOR_FREQUENCY = 100;

class Monitor extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    oauth: PropTypes.shape({
      started: PropTypes.bool,
      popup: PropTypes.any,
      errors: PropTypes.arrayOf(PropTypes.string)
    })
    /* eslint-enable react/no-unused-prop-types */
  };

  componentDidMount() {
    this.popupMonitorId = setInterval(this.monitorPopup, MONITOR_FREQUENCY);

    window.addEventListener("message", this.onMessage);
  }

  componentWillUnmount() {
    clearInterval(this.popupMonitorId);

    window.removeEventListener("message", this.onMessage);
  }

  onMessage = event => {
    if (isOauthEvent(event)) {
      this.props.dispatch(oauthActions.oauthResponse(event));
    }
  };

  get errors() {
    return get(this, "props.oauth.errors");
  }

  get popup() {
    return get(this, "props.oauth.popup");
  }

  get started() {
    return get(this, "props.oauth.started");
  }

  monitorPopup = () => {
    if (this.started && this.popup && this.popup.closed) {
      this.props.dispatch(oauthActions.cancel());
    }
  };

  hasErrors() {
    return isArray(this.errors) && this.errors.length > 0;
  }

  render() {
    let errorList = null;

    if (this.hasErrors()) {
      errorList = (
        <ul role="alert">
          {this.errors.map(error => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      );
    }

    return <div>{errorList}</div>;
  }
}

export default connect(mapStateToProps)(Monitor);
