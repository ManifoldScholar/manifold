import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";

class ConfirmableButton extends Component {
  static displayName = "Utility.ConfirmableButton";

  static propTypes = {
    label: PropTypes.string.isRequired,
    confirmHandler: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  static defaultProps = {};

  constructor() {
    super();
    this.state = { confirmation: false };
    this.deleteButton = React.createRef();
    this.confirmButton = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.confirmation === this.state.confirmation) return null;

    const nextFocusedEl = this.state.confirmation
      ? this.confirmButton
      : this.deleteButton;

    this.setFocus(nextFocusedEl);
  }

  setFocus(ref) {
    if (!ref || !ref.current) return null;
    ref.current.focus();
  }

  toggleConfirmation = () => {
    this.setState({ confirmation: !this.state.confirmation });
  };

  handleConfirm = () => {
    this.setFocus(this.deleteButton);
    this.props.confirmHandler();
  };

  render() {
    const t = this.props.t;

    return (
      <div className="confirmable-button">
        <button
          className="confirmable-button__button confirmable-button__button--delete"
          onClick={this.state.confirmation ? () => {} : this.toggleConfirmation}
          aria-disabled={this.state.confirmation}
          ref={this.deleteButton}
        >
          {this.props.label}
        </button>
        {this.state.confirmation && (
          <ul
            aria-label={t("actions.delete")}
            className="confirmable-button__confirm-list"
          >
            <li className="confirmable-button__confirm-item">
              <button
                className="confirmable-button__button confirmable-button__button--confirm"
                onClick={this.handleConfirm}
                ref={this.confirmButton}
              >
                <span className="screen-reader-text">
                  {t("actions.confirm_delete")}
                </span>
                <span aria-hidden>{t("actions.confirm")}</span>
              </button>
            </li>
            <li className="confirmable-button__confirm-item">
              <button
                className="confirmable-button__button confirmable-button__button--deny"
                onClick={this.toggleConfirmation}
              >
                <span className="screen-reader-text">
                  {t("actions.cancel_delete")}
                </span>
                <span aria-hidden>{t("actions.cancel")}</span>
              </button>
            </li>
          </ul>
        )}
      </div>
    );
  }
}

export default withTranslation()(ConfirmableButton);
