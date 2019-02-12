import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import Form from "./Form";

export class CallToActionNew extends PureComponent {
  static displayName = "CallToAction.New";

  static propTypes = {
    location: PropTypes.object,
    project: PropTypes.object
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

  get project() {
    return this.props.project;
  }

  render() {
    return <Form actionCallout={this.state} project={this.project} />;
  }
}

export default connectAndFetch(CallToActionNew);
