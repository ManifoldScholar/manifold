import React from "react";
import hoistStatics from "hoist-non-react-statics";
import { connect } from "react-redux";
import { select } from "utils/entityUtils";
import { requests } from "api";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default function withSettings(WrappedComponent) {
  const displayName = `WithSettings('${getDisplayName(WrappedComponent)})`;

  class WithSettings extends React.PureComponent {
    static mapStateToProps = state => {
      return {
        settings: select(requests.settings, state.entityStore)
      };
    };

    static WrappedComponent = WrappedComponent;

    static displayName = displayName;

    render() {
      const props = { ...this.props };
      return React.createElement(WrappedComponent, props);
    }
  }

  const ConnectedWithSettings = connect(WithSettings.mapStateToProps)(
    WithSettings
  );

  return hoistStatics(ConnectedWithSettings, WrappedComponent);
}
