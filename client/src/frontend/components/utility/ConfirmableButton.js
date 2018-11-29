import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ConfirmableButton extends Component {
  static displayName = "Utility.ConfirmableButton";

  static propTypes = {
    label: PropTypes.string.isRequired,
    confirmHandler: PropTypes.func.isRequired
  };

  static defaultProps = {};

  constructor() {
    super();
    this.state = { confirmation: false };
  }

  toggleConfirmation = () => {
    this.setState({ confirmation: !this.state.confirmation });
  };

  handleConfirm = () => {
    this.props.confirmHandler();
  };

  renderConfirmation() {
    return (
      <div className="confirmation">
        <div className="confirmation-label">{this.props.label}</div>
        <button className="confirm" onClick={this.handleConfirm}>
          Confirm
        </button>
        <button className="deny" onClick={this.toggleConfirmation}>
          Cancel
        </button>
      </div>
    );
  }

  renderButton() {
    return (
      <button onClick={this.toggleConfirmation}>{this.props.label}</button>
    );
  }

  render() {
    return this.state.confirmation
      ? this.renderConfirmation()
      : this.renderButton();
  }
}
