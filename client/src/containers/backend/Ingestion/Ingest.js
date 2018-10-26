import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { ingestionsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { select, isLoaded } from "utils/entityUtils";
import get from "lodash/get";
import truncate from "lodash/truncate";
import capitalize from "lodash/capitalize";
import { websocketActions } from "actions";
import classnames from "classnames";
import lh from "helpers/linkHandler";
import { Ingestion } from "components/backend";

const { request, flush } = entityStoreActions;

export class IngestionIngest extends Component {
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

  static displayName = "ProjectDetail.Text.Ingest";

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

  static defaultProps = {
    setDialogClassName: () => {} // noop
  };

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
  }

  componentWillUnmount() {
    this.closeSocket();
    this.props.dispatch(flush(requests.beIngestionShow));
    if (this.props.refresh) this.props.refresh();
  }

  setDialogClassName() {
    const dialogClass = this.props.webSocketFailure ? "dialog-error" : "";
    this.props.setDialogClassName(dialogClass);
  }

  get canProcess() {
    const { ingestion, webSocketConnected } = this.props;
    if (!ingestion || !webSocketConnected) return false;
    return ingestion.attributes.availableEvents.includes("process");
  }

  get canReset() {
    const { ingestion, webSocketConnected } = this.props;
    if (!ingestion || !webSocketConnected) return false;
    return ingestion.attributes.availableEvents.includes("reset");
  }

  get isModal() {
    return this.props.route.modal;
  }

  reset = () => {
    if (this.state.loading) return;
    this.setState({ textLog: "" });
    this.props.dispatch(
      websocketActions.triggerAction(this.channelName, "reset")
    );
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
    this.props.history.push(this.closeUrl());
  };

  backToEdit = (event = null) => {
    if (event) event.preventDefault();
    this.props.history.push(this.editUrl(), { stage: "upload" });
  };

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

  handleMessage(payload) {
    if (payload === "START_ACTION") return this.startLoading(payload);
    if (payload === "END_ACTION") return this.stopLoading(payload);
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

  openSocket(ingestionId) {
    const options = { ingestion: ingestionId };
    this.props.dispatch(websocketActions.subscribe(this.channelName, options));
  }

  closeSocket() {
    this.props.dispatch(websocketActions.unsubscribe(this.channelName));
  }

  editUrl() {
    if (this.props.text) {
      const { id, ingestionId } = this.props.match.params;
      return lh.link("backendTextIngestionEdit", id, ingestionId);
    }
    const { id, ingestionId } = this.props.match.params;
    return lh.link("backendProjectTextsIngestionEdit", id, ingestionId);
  }

  closeUrl() {
    if (this.props.text) {
      const { id } = this.props.match.params;
      return lh.link("backendTextIngestionsNew", id);
    }
    const { id } = this.props.match.params;
    return lh.link("backendProjectTexts", id);
  }

  scrollToLogBottom() {
    if (!this.logEl) return;
    this.logEl.scrollTop = this.logEl.scrollHeight;
  }

  appendToLog(message) {
    if (message[0] === "DEBUG") return;
    const textLog = this.state.textLog.concat("\n").concat(message[1]);
    this.setState({ textLog });
  }

  title(attr) {
    const title = attr.sourceFileName || attr.externalSourceUrl;
    if (!title) return "";
    return truncate(title, { length: 40 });
  }

  renderFinished() {
    if (this.isModal) {
      return (
        <button onClick={this.complete} className="button-icon-secondary">
          <i className="manicon manicon-check small" aria-hidden="true" />
          <span>{"Complete"}</span>
        </button>
      );
    }
    return null;
  }

  render() {
    if (!this.props.ingestion) return null;
    const attr = this.props.ingestion.attributes;
    const resetButtonClass = classnames("button-bare-primary", {
      loading: this.state.loading || !this.canReset
    });

    if (this.props.webSocketFailure === true) {
      return <Ingestion.ConnectionError close={this.complete} />;
    }

    return (
      <div>
        <div className="ingestion-output">
          <header className="entity-header-primary">
            <figure aria-hidden="true">
              <i className="manicon manicon-text-placeholder" />
            </figure>
            <div className="title">
              <h1>{this.title(attr)}</h1>
            </div>
          </header>
          <div className="properties">
            <div className="item">
              <p className="label">Current state</p>
              <p className="value">{capitalize(attr.state)}</p>
            </div>
            <div className="item">
              <p className="label">Strategy</p>
              <p className="value">{attr.strategyLabel || "None"}</p>
            </div>
            <div className="item">
              <p className="label">Text ID</p>
              <p className="value">
                {attr.textId
                  ? attr.textId
                  : "This ingestion will create a new text"}
              </p>
            </div>
          </div>
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
            >
              <i className="manicon manicon-x-bold" aria-hidden="true" />
              Restart Ingestion
            </button>
          </div>
        </div>
        <div style={{ marginTop: 30 }} className="buttons-icon-horizontal">
          {this.props.ingestion.attributes.state !== "finished" &&
          this.props.ingestion.attributes.state !== "processing" ? (
            <button
              onClick={this.backToEdit}
              className="button-icon-secondary dull"
            >
              <i className="manicon manicon-x small" aria-hidden="true" />
              Back
            </button>
          ) : null}
          {this.canProcess ? (
            <button onClick={this.ingest} className="button-icon-secondary">
              <i
                className="manicon manicon-arrow-right small"
                aria-hidden="true"
              />
              <span>{"Ingest"}</span>
            </button>
          ) : null}
          {this.props.ingestion.attributes.state === "finished"
            ? this.renderFinished()
            : null}
        </div>
      </div>
    );
  }
}

export default connectAndFetch(IngestionIngest);
