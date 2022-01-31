import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { actionCalloutsAPI, requests } from "api";
import { select } from "utils/entityUtils";
import Form from "./Form";
import { entityStoreActions } from "actions";

const { request } = entityStoreActions;

export class CallToActionEdit extends Component {
  static displayName = "CallToAction.Edit";

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    calloutable: PropTypes.object.isRequired,
    closeRoute: PropTypes.string.isRequired,
    refreshActionCallouts: PropTypes.func,
    actionCallout: PropTypes.object
  };

  static mapStateToProps = (state, ownPropsIgnored) => {
    return {
      actionCallout: select(requests.beActionCallout, state.entityStore)
    };
  };

  componentDidMount() {
    this.fetchActionCallout(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchActionCallout(this.props.match.params.id);
    }
  }

  get calloutable() {
    return this.props.calloutable;
  }

  get actionCallout() {
    return this.props.actionCallout;
  }

  fetchActionCallout(id) {
    const call = actionCalloutsAPI.show(id);
    const actionCalloutRequest = request(call, requests.beActionCallout);
    this.props.dispatch(actionCalloutRequest);
  }

  render() {
    if (!this.actionCallout) return null;
    return (
      <Form
        refreshActionCallouts={this.props.refreshActionCallouts}
        actionCallout={this.actionCallout}
        closeRoute={this.props.closeRoute}
        calloutable={this.calloutable}
      />
    );
  }
}

export default connectAndFetch(CallToActionEdit);
