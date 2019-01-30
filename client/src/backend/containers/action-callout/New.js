import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import Form from "./Form";

export class CallToActionNew extends Component {
  static displayName = "CallToAction.New";

  static propTypes = {
    location: PropTypes.object,
    project: PropTypes.object
  };

  get pendingActionCallout() {
    const attributes = {
      kind: "link",
      location: "left",
      position: "top",
      button: true
    };
    if (!this.props.location.state) return { attributes };
    return {
      attributes: Object.assign(
        attributes,
        this.props.location.state.actionCallout.attributes
      )
    };
  }

  get project() {
    return this.props.project;
  }

  render() {
    return (
      <Form actionCallout={this.pendingActionCallout} project={this.project} />
    );
  }
}

export default connectAndFetch(CallToActionNew);
