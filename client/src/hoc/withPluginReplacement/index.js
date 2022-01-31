import React from "react";
import PropTypes from "prop-types";
import hoistStatics from "hoist-non-react-statics";
import { connect } from "react-redux";
import pluginRegistry from "services/plugin/registry";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default function withPluginReplacement(WrappedComponent, region) {
  const displayName = `withPluginReplacement('${getDisplayName(
    WrappedComponent
  )})`;

  class WithPluginReplacement extends React.PureComponent {
    static mapStateToProps = state => {
      const components = state.plugin.components;
      const config = components[region];
      if (!config) return {};
      const replacement = pluginRegistry.get(config.id);
      if (replacement) return { replacement };
      return {};
    };

    static WrappedComponent = WrappedComponent;

    static displayName = displayName;

    static propTypes = {
      replacement: PropTypes.func
    };

    render() {
      if (this.props.replacement) {
        return React.createElement(this.props.replacement, this.props);
      }
      return React.createElement(WrappedComponent, this.props);
    }
  }

  const ConnectedWithPluginReplacement = connect(
    WithPluginReplacement.mapStateToProps
  )(WithPluginReplacement);

  return hoistStatics(ConnectedWithPluginReplacement, WithPluginReplacement);
}
