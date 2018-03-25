import React from "react";
import hoistStatics from "hoist-non-react-statics";

function getDisplayName(WrappedComponent) {
  let Wrapped = WrappedComponent;
  if (WrappedComponent.WrappedComponent) {
    Wrapped = WrappedComponent.WrappedComponent;
  }
  return Wrapped.displayName || Wrapped.name || "Component";
}

export default function fetchData(WrappedComponent) {
  const displayName = `HigherOrder.FetchData('${getDisplayName(
    WrappedComponent
  )})`;

  class FetchData extends React.PureComponent {
    static displayName = displayName;
    static WrappedComponent = WrappedComponent;

    fetchData = propsIgnored => {
      // Noop in test
    };

    render() {
      const props = Object.assign({}, this.props, {
        fetchData: this.fetchData
      });
      return React.createElement(WrappedComponent, props);
    }
  }

  return hoistStatics(FetchData, WrappedComponent);
}
