import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ConfirmableButton extends Component {
  static defaultProps = {};

  static displayName = "Utility.ConfirmableButton";

  static propTypes = {
    label: PropTypes.string.isRequired,
    confirmHandler: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.state = { confirmation: false };
  }

  handleConfirm = () => {
    this.props.confirmHandler();
  };

  toggleConfirmation = () => {
    this.setState(prevState => ({ confirmation: !prevState.confirmation }));
  };

  renderButton() {
    return (
      <button onClick={this.toggleConfirmation} type="button">
        {this.props.label}
      </button>
    );
  }

  renderConfirmation() {
    return (
      <div className="confirmation">
        <div className="confirmation-label">{this.props.label}</div>
        <button className="confirm" onClick={this.handleConfirm} type="button">
          Confirm
        </button>
        <button
          className="deny"
          onClick={this.toggleConfirmation}
          type="button"
        >
          Cancel
        </button>
      </div>
    );
  }

  render() {
    return this.state.confirmation
      ? this.renderConfirmation()
      : this.renderButton();
  }
}
