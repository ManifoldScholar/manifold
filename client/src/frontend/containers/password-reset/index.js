import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { passwordsAPI, requests } from "api";
import Form from "global/components/form";
import { entityStoreActions, currentUserActions } from "actions";
import { get } from "lodash";

const { request, flush } = entityStoreActions;

export class PasswordResetContainer extends Component {
  static mapStateToProps = state => {
    return {
      response: get(state.entityStore.responses, requests.gPasswordReset)
    };
  };

  static propTypes = {
    dispatch: PropTypes.func,
    match: PropTypes.shape({
      params: PropTypes.shape({
        resetToken: PropTypes.string
      })
    }).isRequired,
    history: PropTypes.object.isRequired,
    response: PropTypes.object
  };

  constructor() {
    super();
    this.state = {
      password: "",
      passwordConfirmation: ""
    };
  }

  componentWillUnmount() {
    this.props.dispatch(flush([requests.gPasswordReset]));
  }

  handleSubmit = event => {
    event.preventDefault(event.target);
    const action = passwordsAPI.update(
      this.state.password,
      this.state.passwordConfirmation,
      this.props.match.params.resetToken
    );
    const changeRequest = request(action, requests.gPasswordReset);
    this.props.dispatch(changeRequest).promise.then(response => {
      this.postUpdate(response.data);
    });
  };

  postUpdate(data) {
    this.loginUser(data);
    this.redirectToHome();
  }

  loginUser(user) {
    this.props.dispatch(
      currentUserActions.login({
        email: user.attributes.email,
        password: this.state.password
      })
    );
  }

  redirectToHome() {
    this.props.history.push("/");
  }

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const errors = get(this.props.response, "errors") || [];
    return (
      <section>
        <div className="container">
          <form method="post" onSubmit={event => this.handleSubmit(event)}>
            <h4 className="form-heading">Reset Password</h4>
            <div className="row-1-p" />
            <div className="row-1-p">
              <Form.Errorable
                className="form-input"
                name="attributes[password]"
                errors={errors}
                idForError="reset-password-error"
              >
                <label htmlFor="reset-password">New Password</label>
                <input
                  value={this.state.password}
                  type="password"
                  name="password"
                  id="reset-password"
                  onChange={this.handleInputChange}
                  placeholder="Password"
                  aria-describedby="reset-password-error"
                />
              </Form.Errorable>
            </div>
            <div className="row-1-p">
              <Form.Errorable
                className="form-input"
                name="attributes[passwordConfirmation]"
                errors={errors}
                idForError="reset-password-confirmation-error"
              >
                <label htmlFor="reset-password-confirmation">
                  Confirm Password
                </label>
                <input
                  value={this.state.passwordConfirmation}
                  type="password"
                  name="passwordConfirmation"
                  id="reset-password-confirmation"
                  onChange={this.handleInputChange}
                  placeholder="Confirm Password"
                  aria-describedby="reset-password-confirmation-error"
                />
              </Form.Errorable>
            </div>
            <div className="row-1-p">
              <Form.Errorable
                className="form-input"
                name="attributes[resetToken]"
                errors={errors}
              >
                <input
                  className="button-secondary button-with-room"
                  type="submit"
                  value="Reset Password"
                />
              </Form.Errorable>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default connectAndFetch(PasswordResetContainer);
