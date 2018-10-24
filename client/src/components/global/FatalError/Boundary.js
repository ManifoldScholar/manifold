import React, { Component } from "react";
import FatalError from "./index";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import locationHelper from "helpers/location";

class FatalErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  componentDidUpdate(prevProps) {
    if (
      locationHelper.unequal(prevProps.location, this.props.location) &&
      this.state.hasError
    ) {
      this.clearError();
    }
  }

  componentDidCatch(error, info) {
    // This will soon be deprecated.
    this.setState({ hasError: true, error, info });
  }

  // Why isn't this being called?
  static getDerivedStateFromError(error, info) {
    this.setState({ hasError: true, error, info });
  }

  get fatalError() {
    const error = this.state.error;
    const info = this.state.info;
    return {
      type: "JS_EXCEPTION",
      error: {
        status: 500,
        heading: "Client Javascript Exception",
        body: this.body(error),
        clientTrace: error.stack,
        clientTraceTruncate: 5,
        componentTrace: info.componentStack
      }
    };
  }

  clearError = () => {
    this.setState({ hasError: false, error: null, info: null });
  };

  body(error) {
    if (error.name === "Error") return `"${error.message}"`;
    return `"${error.name}: ${error.message}"`;
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
