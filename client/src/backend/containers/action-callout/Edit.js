import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { actionCalloutsAPI, requests } from "api";
import { select } from "utils/entityUtils";
import { entityStoreActions } from "actions";
import Form from "./Form";

const { request } = entityStoreActions;

export class CallToActionEdit extends Component {
  static displayName = "CallToAction.Edit";

  static mapStateToProps = (state, ownPropsIgnored) => {
    return {
      actionCallout: select(requests.beActionCallout, state.entityStore)
    };
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    actionCallout: PropTypes.object
  };

  componentDidMount() {
    this.fetchActionCallout(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchActionCallout(this.props.match.params.id);
    }
  }

  get actionCallout() {
    return this.props.actionCallout;
  }

  fetchActionCallout(id) {
    const call = actionCalloutsAPI.show(id);
    const actionCalloutRequest = request(call, requests.beActionCallout);
    this.props.dispatch(actionCalloutRequest);
  }

  get project() {
    return this.props.project;
  }

  render() {
    if (!this.actionCallout) return null;
    return <Form actionCallout={this.actionCallout} project={this.project} />;
  }
}

export default connectAndFetch(CallToActionEdit);
