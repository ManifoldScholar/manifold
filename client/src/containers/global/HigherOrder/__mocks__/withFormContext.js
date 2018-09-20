import React from "react";
import hoistStatics from "hoist-non-react-statics";

function getDisplayName(WrappedComponent) {
  let Wrapped = WrappedComponent;
  if (WrappedComponent.WrappedComponent) {
    Wrapped = WrappedComponent.WrappedComponent;
  }
  return Wrapped.displayName || Wrapped.name || "Component";
}

export default function withFormContext(WrappedComponent) {
  const displayName = `HigherOrder.FetchData('${getDisplayName(
    WrappedComponent
  )})`;

  class WithFormContext extends React.PureComponent {
    static WrappedComponent = WrappedComponent;
    static displayName = displayName;

    render() {
      const formProps = {
        actions: {
          set: () => {}
        },
        dirtyModel: {},
        sourceModel: {},
        getModelValue: name => "",
        sessionKey: "1234",
        submitKey: null
      };

      const props = Object.assign({}, formProps, this.props);
      return React.createElement(WrappedComponent, props);
    }
  }

  return hoistStatics(WithFormContext, WrappedComponent);
}
