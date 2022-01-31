import React from "react";
import hoistStatics from "hoist-non-react-statics";
import FormContext from "helpers/contexts/FormContext";

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
      const mockProps = {
        actions: {
          set: () => {}
        },
        dirtyModel: {},
        sourceModel: {},
        getModelValue: () => "",
        sessionKey: "1234",
        submitKey: null
      };

      return (
        <FormContext.Consumer>
          {formProps => {
            const props = { ...mockProps, ...formProps, ...this.props };
            return React.createElement(WrappedComponent, props);
          }}
        </FormContext.Consumer>
      );
    }
  }

  return hoistStatics(WithFormContext, WrappedComponent);
}
