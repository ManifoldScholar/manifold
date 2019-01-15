import React, { Component } from "react";
import Dialog from "backend/components/dialog";

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

    confirm = (heading, message, callback) => {
      new Promise((resolve, reject) => {
        this.setState({ confirmation: { resolve, reject, heading, message } });
      }).then(
        () => {
          callback();
          this.closeDialog();
        },
        () => {
          this.closeDialog();
        }
      );
    };

    render() {
      return (
        <React.Fragment>
          {this.state.confirmation && (
            <Dialog.Confirm {...this.state.confirmation} />
          )}
          {React.createElement(
            WrappedComponent,
            Object.assign({}, this.props, { confirm: this.confirm })
          )}
        </React.Fragment>
      );
    }
  }

  return WithConfirmation;
}

export default withConfirmation;
