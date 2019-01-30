import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import Form from "./Form";
import memoize from "lodash/memoize";

export class CallToActionNew extends PureComponent {
  static displayName = "CallToAction.New";

  static propTypes = {
    location: PropTypes.object,
    project: PropTypes.object
  };

  get project() {
    return this.props.project;
  }

  pendingActionCallout = memoize(
    () => {
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
    },
    () => this.props.location.state
  );

  render() {
    return (
      <Form
        actionCallout={this.pendingActionCallout()}
        project={this.project}
      />
    );
  }
}

export default connectAndFetch(CallToActionNew);
