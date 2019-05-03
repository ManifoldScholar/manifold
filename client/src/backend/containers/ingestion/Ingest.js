import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { ingestionsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { select, isLoaded } from "utils/entityUtils";
import Utility from "global/components/utility";
import get from "lodash/get";
import throttle from "lodash/throttle";
import { websocketActions, notificationActions } from "actions";
import classnames from "classnames";
import lh from "helpers/linkHandler";
import config from "config";
import Actions from "./Actions";
import Heading from "./Heading";

const { request, flush } = entityStoreActions;

export class IngestionIngest extends Component {
  static defaultProps = {
    setDialogClassName: () => {} // noop
  };

  static displayName = "ProjectDetail.Text.Ingest";

  static fetchData = (getState, dispatch, location, match) => {
    if (isLoaded(requests.beIngestionShow, getState())) return;
    const call = ingestionsAPI.show(match.params.ingestionId);
    const ingestion = request(call, requests.beIngestionShow);
    const { promise: one } = dispatch(ingestion);
    return Promise.all([one]);
  };

  static mapStateToProps = (state, ownPropsIgnored) => {
    return {
      webSocketFailure: state.websocket.failure,
      webSocketConnecting: state.websocket.connecting,
      webSocketConnected: state.websocket.connected,
      channel: get(state.websocket.channels, "IngestionChannel"),
      ingestion: select(requests.beIngestionShow, state.entityStore)
    };
  };

  static propTypes = {
    ingestion: PropTypes.object,
    channel: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    refresh: PropTypes.func,
    text: PropTypes.object,
    match: PropTypes.object,
    setDialogClassName: PropTypes.func,
    webSocketConnected: PropTypes.bool,
    webSocketFailure: PropTypes.bool
  };

  scrollToLogBottom = throttle(() => {
    if (!this.logEl) return;
    this.logEl.scrollTop = this.logEl.scrollHeight;
  }, 250);

  constructor(props) {
    super(props);

    this.state = {
      textLog: "Connecting to Manifold websocket...",
      loading: false
    };

    this.channelName = "IngestionChannel";
  }

  componentDidMount() {
    if (this.props.ingestion) this.openSocket(this.props.ingestion.id);
    this.setDialogClassName();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.ingestion && !prevProps.ingestion)
      this.openSocket(this.props.ingestion.id);
    if (
      prevProps.webSocketConnected === false &&
      this.props.webSocketConnected
    ) {
      this.appendToLog(["INFO", "Successfully connected to websocket."]);
    }
    if (prevState.textLog !== this.state.textLog) this.scrollToLogBottom();
    this.maybeProcessMessage(this.props.channel, prevProps.channel, prevProps);
    this.setDialogClassName();

    if (prevProps.webSocketConnecting && this.props.webSocketFailure) {
      this.displayError();
    }
  }

  componentWillUnmount() {
    this.closeSocket();
    this.props.dispatch(flush(requests.beIngestionShow));
    if (this.props.refresh) this.props.refresh();
  }

  get canReset() {
    const { ingestion, webSocketConnected } = this.props;
    if (!ingestion || !webSocketConnected) return false;
    return ingestion.attributes.availableEvents.includes("reset");
  }

  get closeUrl() {
    const { id } = this.props.match.params;
    const path = this.props.text
      ? "backendTextIngestionsNew"
      : "backendProjectTexts";

    return lh.link(path, id);
  }

  get editUrl() {
    const { id, ingestionId } = this.props.match.params;
    const path = this.props.text
      ? "backendTextIngestionEdit"
      : "backendProjectTextsIngestionEdit";

    return lh.link(path, id, ingestionId);
  }

  get isReingestion() {
    return this.props.ingestion.attributes.textId;
  }

  setDialogClassName() {
    const dialogClass = this.props.webSocketFailure ? "dialog-error" : "";
    this.props.setDialogClassName(dialogClass);
  }

  reset = () => {
    if (this.state.loading) return;
    this.setState({ textLog: "" }, () => {
      this.props.dispatch(
        websocketActions.triggerAction(this.channelName, "reset")
      );
    });
  };

  ingest = () => {
    if (this.state.loading) return;
    this.props.dispatch(
      websocketActions.triggerAction(this.channelName, "process")
    );
  };

  reingest = () => {
    if (this.state.loading) return;
    this.props.dispatch(
      websocketActions.triggerAction(this.channelName, "reingest")
    );
  };

  complete = () => {
    this.props.history.push(this.closeUrl);
  };

  backToEdit = () => {
    this.props.history.push(this.editUrl, { stage: "upload" });
  };

  appendToLog(message) {
    if (message[0] === "DEBUG") return;
    this.setState(prevState => ({
      textLog: prevState.textLog.concat("\n").concat(message[1])
    }));
  }

  closeSocket() {
    this.props.dispatch(websocketActions.unsubscribe(this.channelName));
  }

  displayError() {
    const body = (
      <React.Fragment>
        {config.services.cable ? (
          <span>
            {"The client application is unable to connect to the server's websocket. " +
              'Please ensure that Manifold\'s "cable" service is available at the ' +
              "following location:"}
            <br />
            <br />
            <em>{config.services.cable}</em>
          </span>
        ) : (
          <span>
            {"The CABLE_URL environment variable has not been set correctly. Please " +
              "contact the administrator of this Manifold instance to correct this."}
          </span>
        )}
        <br />
        <br />
        <span>
          {"After the problem has been corrected, this ingestion can be resumed at the " +
            "current URL."}
        </span>
      </React.Fragment>
    );

    const notification = {
      level: 2,
      id: `WEBSOCKET_ERROR`,
      heading: "Fatal Ingestion Error",
      body,
      scope: this.isReingestion ? "global" : "drawer",
      expiration: 0,
      removeNotification: this.complete
    };
    this.props.dispatch(notificationActions.addNotification(notification));
  }

  handleMessage(payload) {
    if (payload === "START_ACTION") return this.startLoading(payload);
    if (payload === "END_ACTION") return this.stopLoading(payload);
  }

  maybeProcessMessage(nextChannel, thisChannel, nextPropsIgnored) {
    const nextMessage = get(nextChannel, "message");
    const lastMessage = get(thisChannel, "message");
    const nextMessageId = get(nextMessage, "id");
    const lastMessageId = get(lastMessage, "id");
    if (!nextMessage) return;
    if (nextMessageId === lastMessageId) return;
    if (nextMessage.type === "message") this.handleMessage(nextMessage.payload);
    if (nextMessage.type === "log") this.appendToLog(nextMessage.payload);
  }

  openSocket(ingestionId) {
    const options = { ingestion: ingestionId };
    this.props.dispatch(websocketActions.subscribe(this.channelName, options));
  }

  startLoading() {
    this.setState({ loading: true }, () => {
      this.props.dispatch({
        type: "START_LOADING",
        payload: "ingestion-websocket"
      });
    });
  }

  stopLoading() {
    this.setState({ loading: false }, () => {
      this.props.dispatch({
        type: "STOP_LOADING",
        payload: "ingestion-websocket"
      });
    });
  }

  render() {
    if (!this.props.ingestion) return null;
    const resetButtonClass = classnames("button-bare-primary", {
      loading: this.state.loading || !this.canReset
    });

    if (this.props.webSocketFailure === true) {
      return null;
    }

    return (
      <div>
        <div className="ingestion-output">
          <Heading
            ingestion={this.props.ingestion}
            reingestion={!!this.isReingestion}
          />
          <Actions
            ingestion={this.props.ingestion}
            connected={this.props.webSocketConnected}
            start={this.ingest}
            cancel={this.backToEdit}
            complete={this.complete}
          />
          <div className="log">
            <p className="label">Log</p>
            <div
              className="value"
              ref={el => {
                this.logEl = el;
              }}
            >
              {this.state.textLog.trim()}
            </div>
          </div>
          <div className="utility">
            <button
              className={resetButtonClass}
              onClick={this.reset}
              disabled={this.state.loading || !this.canReset}
              type="button"
            >
              <Utility.IconComposer icon="reload32" size={24} />
              Restart Ingestion
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default connectAndFetch(IngestionIngest);
