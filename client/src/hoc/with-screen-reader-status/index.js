import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import hoistStatics from "hoist-non-react-statics";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default function withScreenReaderStatus(WrappedComponent) {
  const displayName = `WithScreenReaderStatus('${getDisplayName(
    WrappedComponent
  )})`;

  class WithScreenReaderStatus extends PureComponent {
    static WrappedComponent = WrappedComponent;

    static displayName = displayName;

    constructor(props) {
      super(props);
      this.state = { message: null };
    }

    get childProps() {
      return {
        setScreenReaderStatus: this.setStatus
      };
    }

    setStatus = message => {
      // temporarily update state with new message
      this.setState({ message });

      // remove message
      setTimeout(() => {
        this.setState({ message: null });
      }, 1000);
    };

    renderLiveRegion() {
      return (
        <div
          role="status"
          aria-live="polite"
          aria-atomic
          className="screen-reader-text"
        >
          {this.state.message}
        </div>
      );
    }

    render() {
      const props = Object.assign({}, this.props, this.childProps);

      return (
        <React.Fragment>
          {this.renderLiveRegion()}
          {React.createElement(WrappedComponent, props)}
        </React.Fragment>
      );
    }
  }

  return hoistStatics(WithScreenReaderStatus, WrappedComponent);
}
