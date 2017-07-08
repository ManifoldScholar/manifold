import React, { PureComponent } from "react";
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

const { request, flush } = entityStoreActions;

export class IngestionIngest extends PureComponent {
  static displayName = "ProjectDetail.Text.Ingest";

  static propTypes = {
    ingestion: PropTypes.object,
    channel: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    refresh: PropTypes.func,
    text: PropTypes.object,
    match: PropTypes.object
  };

  static fetchData(getState, dispatch, location, match) {
    if (isLoaded(requests.beIngestionShow, getState())) return;
    const call = ingestionsAPI.show(match.params.ingestionId);
    const ingestion = request(call, requests.beIngestionShow);
    const { promise: one } = dispatch(ingestion);
    return Promise.all([one]);
  }

  static mapStateToProps(state, ownPropsIgnored) {
    return {
      channel: get(state.websocket.channels, "IngestionChannel"),
      ingestion: select(requests.beIngestionShow, state.entityStore)
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      textLog: "",
      loading: false
    };

    this.channelName = "IngestionChannel";
  }

  componentDidMount() {
    if (this.props.ingestion) this.openSocket(this.props.ingestion.id);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.ingestion && nextProps.ingestion)
      this.openSocket(nextProps.ingestion.id);
    this.maybeProcessMessage(nextProps.channel, this.props.channel, nextProps);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.loading !== nextState.loading) return true;
    if (this.props.ingestion !== nextProps.ingestion) return true;
    if (this.state.textLog !== nextState.textLog) return true;
    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.textLog !== this.state.textLog) this.scrollToLogBottom();
  }

  componentWillUnmount() {
    this.closeSocket();
    this.props.dispatch(flush(requests.beIngestionShow));
    if (this.props.refresh) this.props.refresh();
  }

  analyze = () => {
    if (this.state.loading) return;
    this.props.dispatch(
      websocketActions.triggerAction(this.channelName, "analyze")
    );
  };

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
    this.props.dispatch(websocketActions.connect(this.channelName, options));
  }

  closeSocket() {
    this.props.dispatch(websocketActions.disconnect(this.channelName));
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

  get canProcess() {
    const { ingestion } = this.props;
    if (!ingestion) return false;
    return ingestion.attributes.availableEvents.includes("process");
  }

  get canAnalyze() {
    const { ingestion } = this.props;
    if (!ingestion) return false;
    return ingestion.attributes.availableEvents.includes("analyze");
  }

  get canReset() {
    const { ingestion } = this.props;
    if (!ingestion) return false;
    return ingestion.attributes.availableEvents.includes("reset");
  }

  get isModal() {
    return this.props.route.modal;
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
          <i className="manicon manicon-check small" />
          {"Complete"}
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

    return (
      <div>
        <div className="ingestion-output">
          <header className="entity-header-primary">
            <figure>
              <i className="manicon manicon-text-placeholder" />
            </figure>
            <div className="title">
              <h1>
                {this.title(attr)}
              </h1>
              <div className="utility">
                <button
                  className={resetButtonClass}
                  onClick={this.reset}
                  disabled={this.state.loading || !this.canReset}
                >
                  Reset
                  <i className="manicon manicon-x-bold" />
                </button>
              </div>
            </div>
          </header>
          <div className="properties">
            <div className="item">
              <p className="label">Current state</p>
              <p className="value">
                {capitalize(attr.state)}
              </p>
            </div>
            <div className="item">
              <p className="label">Strategy</p>
              <p className="value">
                {attr.strategy || "None"}
              </p>
            </div>
            <div className="item">
              <p className="label">Text</p>
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
        </div>
        <div style={{ marginTop: 30 }} className="buttons-icon-horizontal">
          {this.props.ingestion.attributes.state !== "finished"
            ? <button
                onClick={this.backToEdit}
                className="button-icon-secondary dull"
              >
                <i className="manicon manicon-x small" />
                Back
              </button>
            : null}

          {this.canProcess
            ? <button onClick={this.ingest} className="button-icon-secondary">
                <i className="manicon manicon-arrow-right small" />
                {"Ingest"}
              </button>
            : null}
          {this.canAnalyze
            ? <button onClick={this.analyze} className="button-icon-secondary">
                <i className="manicon manicon-arrow-right small" />
                {"Analyze"}
              </button>
            : null}
          {this.props.ingestion.attributes.state === "finished"
            ? this.renderFinished()
            : null}
        </div>
      </div>
    );
  }
}

export default connectAndFetch(IngestionIngest);
