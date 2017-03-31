import React, { Component, PropTypes } from 'react';
import { Dialog } from 'components/backend';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Form } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import { ingestionsAPI, requests } from 'api';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import isObject from 'lodash/isObject';
import has from 'lodash/has';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import capitalize from 'lodash/capitalize';
import { browserHistory } from 'react-router';
import { websocketActions } from 'actions';
const { select } = entityUtils;
const { request, flush } = entityStoreActions;

class ProjectDetailTextIngest extends Component {

  static displayName = "ProjectDetail.Text.Ingest";
  static activeNavItem = "texts";

  static propTypes = {
    ingestion: PropTypes.object,
    channel: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object,
    refresh: PropTypes.func.isRequired
  }

  static fetchData(getState, dispatch, location, params) {
    if (entityUtils.isLoaded(requests.beIngestionShow, getState())) return;
    const call = ingestionsAPI.show(params.ingestionId);
    const ingestion = request(call, requests.beIngestionShow);
    const { promise: one } = dispatch(ingestion);
    return Promise.all([one]);
  }

  static mapStateToProps(state, ownProps) {
    return {
      channel: get(state.websocket.channels, "IngestionChannel"),
      ingestion: select(requests.beIngestionShow, state.entityStore),
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      textLog: ""
    };

    this.channelName = "IngestionChannel";
    this.backToEdit = this.backToEdit.bind(this);
  }

  componentDidMount() {
    if (this.props.ingestion) this.openSocket(this.props.ingestion.id);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.ingestion && nextProps.ingestion) this.openSocket(nextProps.ingestion.id);
    this.maybeProcessMessage(nextProps.channel, this.props.channel, nextProps);
  }

  componentWillUnmount() {
    this.closeSocket();
    this.props.dispatch(flush(requests.beIngestionShow));
    this.props.refresh();
  }

  maybeProcessMessage(nextChannel, thisChannel, nextProps) {
    const nextMessage = get(nextChannel, 'message');
    const lastMessage = get(thisChannel, 'message');
    const nextMessageId = get(nextMessage, 'id');
    const lastMessageId = get(lastMessage, 'id');
    if (!nextMessage) return;
    if (nextMessageId === lastMessageId) return;
    if (nextMessage.type === "log") this.appendToLog(nextMessage.payload);
  }

  openSocket(ingestionId) {
    const options = { ingestion: ingestionId };
    this.props.dispatch(websocketActions.connect(this.channelName, options));
  }

  closeSocket() {
    this.props.dispatch(websocketActions.disconnect(this.channelName));
  }

  backToEdit(event = null) {
    if (event) event.preventDefault();
    browserHistory.push(this.editUrl());
  }

  triggerEvent(domEvent = null, event) {
    if (domEvent) domEvent.preventDefault();
    this.clearLog();
    this.props.dispatch(websocketActions.triggerAction(this.channelName, event));
  }

  editUrl() {
    return `/backend/project/${this.props.params.id}/texts/new/${this.props.ingestion.id}/step/2`;
  }

  clearLog() {
    this.setState({ textLog: "" });
  }

  appendToLog(message) {
    if (message[0] === "DEBUG") return;
    const textLog = this.state.textLog.concat("\n").concat(message[1]);
    this.setState({ textLog });
  }

  renderMessages() {
    return (
      <div className="log-wrapper" ref={(el) => { this.logEl = el; }}>
        {this.state.textLog}
      </div>
    );
  }

  renderIngestion() {
    const attr = this.props.ingestion.attributes;
    return (
      <header className="entity-header-primary">
        <figure>
          <i className="manicon manicon-text-placeholder"></i>
        </figure>
        <div className="title">
          <h1>
            {attr.sourceFileName}
          </h1>
          <div className="utility">
            <p>Current state: {attr.state}</p>
            <p>Strategy: {attr.strategy}</p>
            {attr.textId ?
              <p>{`Text Target: ${attr.textId}`}</p>
            :
              <p>Text Target: This ingestion will create a new text</p>
            }
          </div>
        </div>
      </header>
    );
  }

  render() {
    if (!this.props.ingestion) return null;
    return (
      <div>
        <div className="ingestion-output">
          {this.renderIngestion()}
          {this.renderMessages()}
        </div>
        <div style={{ marginTop: 30 }} className="buttons-icon-horizontal">
          <button
            onClick={this.backToEdit}
            className="button-icon-secondary"
          >
            <i className="manicon manicon-x small"></i>
            Back
          </button>
          {this.props.ingestion.attributes.availableEvents.map((event, index) => {
            return (
              <button
                key={index}
                onClick={(domEvent) => { this.triggerEvent(domEvent, event); }}
                className="button-icon-secondary"
              >
                <i className="manicon manicon-check small"></i>
                {capitalize(event)}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

}

export default connect(
  ProjectDetailTextIngest.mapStateToProps
)(withRouter(ProjectDetailTextIngest));
