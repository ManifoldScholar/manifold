import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import locationHelper from "helpers/location";
import FatalError from "./index";

class FatalErrorBoundary extends Component {
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  componentDidUpdate(prevProps) {
    if (
      locationHelper.unequal(prevProps.location, this.props.location) &&
      this.state.hasError
    ) {
      this.clearError();
    }
  }

  body(error) {
    if (error.name === "Error") return `"${error.message}"`;
    return `"${error.name}: ${error.message}"`;
  }

  clearError = () => {
    this.setState({ hasError: false, error: null });
  };

  // noop, this lifecycle method just needs to be present
  // to log the component stack to the console in development
  componentDidCatch(errorIgnored, infoIgnored) {}

  get fatalError() {
    const error = this.state.error;
    return {
      type: "JS_EXCEPTION",
      error: {
        status: 500,
        heading: "Client Javascript Exception",
        body: this.body(error),
        clientTrace: error.stack,
        clientTraceTruncate: 5
      }
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <FatalError dismiss={this.clearError} fatalError={this.fatalError} />
      );
    }

    return this.props.children;
  }
}

export default withRouter(FatalErrorBoundary);
