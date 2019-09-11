import React from "react";
import hoistStatics from "hoist-non-react-statics";
import { connect } from "react-redux";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default function withDispatch(WrappedComponent) {
  const displayName = `HigherOrder.WithDispatch('${getDisplayName(
    WrappedComponent
  )})`;

  class WithDispatch extends React.PureComponent {
    static mapDispatchToProps = dispatch => {
      return { dispatch };
    };

    static WrappedComponent = WrappedComponent;

    static displayName = displayName;

    render() {
      const props = { ...this.props };
      return React.createElement(WrappedComponent, props);
    }
  }

  const ConnectedWithSettings = connect(
    null,
    WithDispatch.mapDispatchToProps
  )(WithDispatch);

  return hoistStatics(ConnectedWithSettings, WrappedComponent);
}
