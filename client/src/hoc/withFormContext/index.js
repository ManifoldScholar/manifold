import React, { Component } from "react";
import { FormContext } from "helpers/contexts";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

function withFormContext(WrappedComponent) {
  const displayName = `HigherOrder.WithFormContext('${getDisplayName(
    WrappedComponent
  )})`;

  class WithFormContext extends Component {
    static WrappedComponent = WrappedComponent;

    static displayName = displayName;

    render() {
      return (
        <FormContext.Consumer>
          {formProps =>
            React.createElement(WrappedComponent, {
              ...this.props,
              ...formProps
            })
          }
        </FormContext.Consumer>
      );
    }
  }

  return WithFormContext;
}

export default withFormContext;
