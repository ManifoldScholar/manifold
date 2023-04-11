import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation, Trans } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import { ingestionsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { select, isLoaded } from "utils/entityUtils";
import Utility from "global/components/utility";
import Heading from "./Heading";
import Actions from "./Actions";
import get from "lodash/get";
import throttle from "lodash/throttle";
import { websocketActions, notificationActions } from "actions";
import lh from "helpers/linkHandler";
import config from "config";

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
    webSocketFailure: PropTypes.bool,
    t: PropTypes.func,
    sectionIngestion: PropTypes.bool
  };

  static defaultProps = {
    setDialogClassName: () => {} // noop
  };

  constructor(props) {
    super(props);

    // textLog is not localized in the v7 first pass. -LD

    this.state = {
      textLog: "Connecting to Manifold websocket...",
      updates: 0,
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

  setDialogClassName() {
    const dialogClass = this.props.webSocketFailure ? "dialog-error" : "";
    this.props.setDialogClassName(dialogClass);
  }

  get canReset() {
    const { ingestion, webSocketConnected } = this.props;
    if (!ingestion || !webSocketConnected) return false;
    return ingestion.attributes.availableEvents.includes("reset");
  }

  get isReingestion() {
    return this.props.ingestion.attributes.state !== "sleeping";
  }

  get editUrl() {
    const { id, ingestionId } = this.props.match.params;
    const path = this.props.text
      ? "backendTextIngestionEdit"
      : "backendProjectTextsIngestionEdit";

    return lh.link(path, id, ingestionId);
  }

  get closeUrl() {
    const { id } = this.props.match.params;

    if (this.props.sectionIngest) return lh.link("backendTextSections", id);

    const path = this.props.text
      ? "backendTextIngestionsNew"
      : "backendProjectTexts";

    return lh.link(path, id);
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
    const options = {
      ingestion: ingestionId
    };
    this.props.dispatch(websocketActions.subscribe(this.channelName, options));
  }

  closeSocket() {
    this.props.dispatch(websocketActions.unsubscribe(this.channelName));
  }

  scrollToLogBottom = throttle(() => {
    if (!this.logEl) return;
    this.logEl.scrollTop = this.logEl.scrollHeight;
  }, 250);

  appendToLog(message) {
    if (message[0] === "DEBUG") return;
    const textLog = this.state.textLog.concat("\n").concat(message[1]);
    this.setState({ textLog });
  }

  displayError() {
    const t = this.props.t;
    const body = (
      <>
        {config.services.cable ? (
          <span>
            <Trans
              i18nKey="texts.ingestion.error.body_cable"
              values={{ cable: config.services.cable }}
            />
          </span>
        ) : (
          <span>{t("texts.ingestion.error.body_no_cable")}</span>
        )}
        <br />
        <br />
        <span>{t("texts.ingestion.error.body_closing")}</span>
      </>
    );

    const notification = {
      level: 2,
      id: `WEBSOCKET_ERROR`,
      heading: t("texts.ingestion.error.heading"),
      body,
      scope: this.isReingestion ? "global" : "drawer",
      expiration: 0,
      removeNotification: this.complete
    };
    this.props.dispatch(notificationActions.addNotification(notification));
  }

  render() {
    if (!this.props.ingestion) return null;

    if (this.props.webSocketFailure === true) {
      return null;
    }

    return (
      <div>
        <div className="ingestion-output">
          <Heading
            ingestion={this.props.ingestion}
            reingestion={!!this.isReingestion}
            sectionIngest={this.props.sectionIngest}
          />
          <Actions
            ingestion={this.props.ingestion}
            connected={this.props.webSocketConnected}
            start={this.ingest}
            cancel={this.backToEdit}
            complete={this.complete}
          />
          <div className="ingestion-output__log">
            <p className="ingestion-output__label">
              {this.props.t("texts.ingestion.log_label")}
            </p>
            <div
              className="ingestion-output__log-value"
              ref={el => {
                this.logEl = el;
              }}
            >
              {this.state.textLog.trim()}
            </div>
          </div>
          <div className="ingestion-output__utility">
            <button
              className="utility-button"
              onClick={this.reset}
              disabled={this.state.loading || !this.canReset}
            >
              <Utility.IconComposer
                icon="reload32"
                size={24}
                className="utility-button__icon utility-button__icon--highlight"
              />
              <span className="utility-button__text">
                {this.props.t("texts.ingestion.restart_button_label")}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(connectAndFetch(IngestionIngest));
