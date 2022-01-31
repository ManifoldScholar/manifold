import React, { Component } from "react";
import hoistStatics from "hoist-non-react-statics";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default function withScreenReaderStatus(
  WrappedComponent,
  renderLiveRegion = true
) {
  const displayName = `WithScreenReaderStatus('${getDisplayName(
    WrappedComponent
  )})`;

  class WithScreenReaderStatus extends Component {
    static WrappedComponent = WrappedComponent;

    static displayName = displayName;

    constructor(props) {
      super(props);
      this.state = { message: null };
    }

    componentWillUnmount() {
      clearTimeout(this.timeout);
    }

    get childProps() {
      const base = {
        setScreenReaderStatus: this.setStatus
      };
      if (renderLiveRegion) return base;
      return {
        renderLiveRegion: this.renderLiveRegion,
        currentScreenReaderStatus: this.state.message,
        ...base
      };
    }

    setStatus = message => {
      // temporarily update state with new message
      this.setState({ message });

      // remove message
      this.timeout = setTimeout(() => {
        this.setState({ message: null });
      }, 1000);
    };

    renderLiveRegion = () => {
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
    };

    render() {
      const props = { ...this.props, ...this.childProps };

      return (
        <>
          {renderLiveRegion && this.renderLiveRegion()}
          {React.createElement(WrappedComponent, props)}
        </>
      );
    }
  }

  return hoistStatics(WithScreenReaderStatus, WrappedComponent);
}
