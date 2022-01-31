import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import Form from "./Form";

export class CallToActionNew extends PureComponent {
  static displayName = "CallToAction.New";

  static propTypes = {
    location: PropTypes.object,
    refreshActionCallouts: PropTypes.func,
    calloutable: PropTypes.object,
    closeRoute: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    let attributes = {
      kind: "link",
      location: "left",
      position: "top",
      button: true
    };

    if (props.location.state && props.location.state.actionCallout) {
      attributes = Object.assign(
        attributes,
        props.location.state.actionCallout.attributes
      );
    }

    this.state = { attributes };
  }

  get calloutable() {
    return this.props.calloutable;
  }

  render() {
    return (
      <Form
        refreshActionCallouts={this.props.refreshActionCallouts}
        actionCallout={this.state}
        closeRoute={this.props.closeRoute}
        calloutable={this.calloutable}
      />
    );
  }
}

export default connectAndFetch(CallToActionNew);
