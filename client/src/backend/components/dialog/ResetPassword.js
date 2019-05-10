import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Wrapper from "./Wrapper";
import Confirm from "./Confirm";
import Form from "global/components/form";
import { entityStoreActions } from "actions";
import { usersAPI, requests, passwordsAPI } from "api";
import { get } from "lodash";
import classNames from "classnames";

const { request, flush } = entityStoreActions;

class ResetPasswordWrapper extends PureComponent {
  static mapStateToProps = (state, ownPropsIgnored) => {
    return {
      response: get(state.entityStore.responses, requests.beUserUpdate)
    };
  };

  static displayName = "ResetPassword.Confirm";

  static propTypes = {
    uiProps: PropTypes.shape({
      message: PropTypes.string,
      heading: PropTypes.string,
      resolve: PropTypes.func.isRequired,
      reject: PropTypes.func.isRequired
    }).isRequired,
    dispatch: PropTypes.func,
    user: PropTypes.object,
    response: PropTypes.object
  };

  static contextTypes = {
    pauseKeyboardEvents: PropTypes.func,
    unpauseKeyboardEvents: PropTypes.func
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      confirm: false,
      password: ""
    };
  }

  componentDidMount() {
    if (this.context.pauseKeyboardEvents) this.context.pauseKeyboardEvents();
    window.addEventListener("keyup", this.handleKeyPress);
  }

  componentWillUnmount() {
    if (this.context.unpauseKeyboardEvents)
      this.context.unpauseKeyboardEvents();
    window.removeEventListener("keyup", this.handleKeyPress);
    this.props.dispatch(flush([requests.beUserUpdate]));
  }

  handleKeyPress = event => {
    event.preventDefault();
    if (event.keyCode === 27) return this.handleRejectClick(event);
  };

  handleResolveClick = () => {
    this.props.uiProps.resolve();
  };

  handleRejectClick = event => {
    event.preventDefault();
    this.props.uiProps.reject();
  };

  handleStateChange(event, name, value) {
    event.preventDefault();
    this.setState({ [name]: value });
  }

  handleInputChange(event) {
    event.preventDefault();
    this.setState({
      password: event.target.value
    });
  }

  resetUserPassword(event, user) {
    event.preventDefault();
    const adjustPassword = this.state.password ? this.state.password : null;
    const adjustedUser = {
      type: this.props.user.type,
      id: this.props.user.id,
      attributes: { password: adjustPassword }
    };
    const call = usersAPI.update(user.id, adjustedUser);
    const userRequest = request(call, requests.beUserUpdate);
    this.props.dispatch(userRequest).promise.then(() => {
      this.handleResolveClick();
    });
  }

  handleResetEmailClick(event, user) {
    event.preventDefault();
    const call = passwordsAPI.admin_reset_password(user.id);
    const passwordRequest = request(call, requests.beUserUpdate);
    this.props.dispatch(passwordRequest).promise.then(() => {
      this.handleResolveClick();
    });
  }

  renderResetForm() {
    const errors = get(this.props.response, "errors") || [];
    const id = "reset-password";
    const errorId = id + "-error";

    return (
      <form
        method="put"
        onSubmit={event => this.resetUserPassword(event, this.props.user)}
      >
        <div className="row-1-p">
          <Form.Errorable
            className="form-input"
            name="attributes[password]"
            errors={errors}
            idForError={errorId}
          >
            <label htmlFor={id}>New Password</label>
            <input
              value={this.state.password}
              onChange={event => this.handleInputChange(event)}
              name="password"
              type="password"
              id={id}
              placeholder="New Password"
              aria-describedby={errorId}
            />
          </Form.Errorable>
        </div>
        <div className="row-1-p">
          <div className="form-input">
            <input
              className={classNames(
                "button-secondary",
                "button-secondary--outlined",
                "button-secondary--with-room"
              )}
              type="submit"
              value="Reset Password"
            />
            <button
              className={classNames(
                "button-secondary",
                "button-secondary--outlined",
                "button-secondary--dull"
              )}
              onClick={event => this.handleStateChange(event, "editing", false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    );
  }

  renderInitial() {
    return (
      <div>
        <header className="dialog-header-small">
          <h2>{this.props.uiProps.heading}</h2>
        </header>

        {this.props.uiProps.message ? (
          <p>{this.props.uiProps.message}</p>
        ) : null}
        {this.state.editing ? (
          this.renderResetForm()
        ) : (
          <div className="form-input">
            <button
              onClick={event => this.handleStateChange(event, "confirm", true)}
              className="button-secondary button-secondary--outlined"
            >
              Generate new password
            </button>
            <button
              onClick={event => this.handleStateChange(event, "editing", true)}
              className="button-secondary button-secondary--outlined"
            >
              Set new password
            </button>
            <button
              className={classNames(
                "button-secondary",
                "button-secondary--outlined",
                "button-secondary--dull"
              )}
              onClick={event => this.handleRejectClick(event)}
            >
              <span
                className={classNames(
                  "button-secondary__text",
                  "button-secondary__text--white",
                  "button-secondary__text--hover-dark"
                )}
              >
                Cancel
              </span>
            </button>
          </div>
        )}
      </div>
    );
  }

  renderConfirmation() {
    return (
      <Confirm
        heading="Are you sure you want to reset this password?"
        message="This action cannot be undone."
        resolve={event => this.handleResetEmailClick(event, this.props.user)}
        reject={event => this.handleStateChange(event, "confirm", false)}
      />
    );
  }

  render() {
    return (
      <Wrapper
        className="dialog-reset"
        maxWidth={400}
        showCloseButton={false}
        closeOnOverlayClick={false}
      >
        {this.state.confirm ? this.renderConfirmation() : this.renderInitial()}
      </Wrapper>
    );
  }
}

export default connect(ResetPasswordWrapper.mapStateToProps)(
  ResetPasswordWrapper
);
