import React, { Component } from "react";
import Dialog from "backend/components/dialog";
import hoistStatics from "hoist-non-react-statics";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

function withConfirmation(WrappedComponent) {
  const displayName = `HigherOrder.WithConfirmation('${getDisplayName(
    WrappedComponent
  )})`;

  class WithConfirmation extends Component {
    static WrappedComponent = WrappedComponent;

    static displayName = displayName;

    constructor(props) {
      super(props);
      this.state = { confirmation: null };
    }

    closeDialog() {
      this.setState({ confirmation: null });
    }

    confirm = (heading, message, callback = null, options = {}) => {
      return new Promise((resolve, reject) => {
        const confirmation = { reject, heading, message, options };
        if (callback) confirmation.resolve = resolve;
        this.setState({ confirmation });
      }).then(
        () => {
          callback();
          this.closeDialog();
        },
        () => {
          this.closeDialog();
          reject();
        }
      );
    };

    render() {
      return (
        <>
          {this.state.confirmation && (
            <Dialog.Confirm {...this.state.confirmation} />
          )}
          {React.createElement(WrappedComponent, {
            ...this.props,
            confirm: this.confirm
          })}
        </>
      );
    }
  }

  return hoistStatics(WithConfirmation, WrappedComponent);
}

export default withConfirmation;
