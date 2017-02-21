import React, { Component, PropTypes } from 'react';
import { passwordsAPI } from 'api';
import { entityStoreActions, notificationActions } from 'actions';
import classNames from 'classnames';
import get from 'lodash/get';
import pull from 'lodash/pull';
import { connect } from 'react-redux';
import { Form } from 'components/backend';
const { request, flush } = entityStoreActions;

class PasswordForgot extends Component {

  static propTypes = {
    showLogin: PropTypes.func.isRequired,
    showCreate: PropTypes.func.isRequired,
    hideSignInUpOverlay: PropTypes.func
  };

  static mapStateToProps(state, ownProps) {
    return {
      response: get(state.entityStore.responses, 'request-reset-password')
    };
  }

  constructor(props) {
    super();
    this.state = {
      submitted: false,
      email: '',
      errors: []
    };
    this.clientErrorHandler = this.clientErrorHandler.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.submissionError = this.submissionError.bind(this);
  }

  componentWillUnmount() {
    this.props.dispatch(flush(['request-reset-password']));
  }

  handleSubmit(event) {
    event.preventDefault(event.target);
    this.setState({ submitted: true }, () => {
      if (!this.hasErrors()) {
        this.props.dispatch(request(passwordsAPI.create(this.state.email), 'request-reset-password')).promise.then(() => {
          this.postSubmit();
        });
      }
      this.setState({ submitted: false });
    })
  }

  postSubmit() {
    this.createSuccessNotification();
    this.closeOverlay();
  }

  createSuccessNotification() {
    const notification = {
      level: 0,
      id: 'PASSWORD_RESET_SENT',
      heading: `Email sent to ${this.state.email} with instructions to reset your password.`
    };
    this.props.dispatch(notificationActions.addNotification(notification));
    setTimeout(() => {
      this.props.dispatch(notificationActions.removeNotification(notification.id));
    }, 5000);
  }

  closeOverlay() {
    this.props.hideSignInUpOverlay();
  }

  handleInputChange(event) {
    this.setState({ email: event.target.value  });
  }

  submissionError() {
    const error = get(this.props.response, 'errors');
    return error;
  }

  hasErrors() {
    return this.state.errors.length > 0;
  }

  clientErrorHandler(fieldName, hasError) {
    const alreadyIncluded = this.state.errors.includes(fieldName);
    if (alreadyIncluded && hasError === false) {
      const errors = pull(this.state.errors.slice(0), fieldName);
      this.setState({ errors });
    }
    if (!alreadyIncluded && hasError === true) {
      const errors = this.state.errors.slice(0);
      errors.push(fieldName);
      this.setState({ errors });
    }
  }

  render() {
    const submitClass = classNames({
      'form-input': true,
      'form-error': this.submissionError()
    });
    return (
      <div>
        <form method="" onSubmit={(event) => this.handleSubmit(event)}>
          <div className="row-1-p">
            <div className="form-input form-error">
              <label>Email</label>
              <Form.HigherOrder.Validation
                submitted={this.state.submitted}
                value={this.state.email}
                errorHandler={this.clientErrorHandler}
                validation={["required"]}
                name="email"
                onChange={(event) => this.handleInputChange(event)}
              >
                <input
                  value={this.state.email}
                  name="email"
                  type="text"
                  id="password-forgot-email"
                  placeholder="Email"
                />
              </Form.HigherOrder.Validation>
            </div>
          </div>
          <div className="row-1-p">
            <div className={submitClass}>
              { this.submissionError() ?
                <span style={{ marginTop: 0 }} className="error">
                  {this.submissionError()}
                </span>
                : null }
              <input
                className="button-secondary button-with-room"
                type="submit"
                value="Send Password Reset Email"
              />
            </div>
          </div>
        </form>
        <p className="login-links">
          <a href="#" onClick={this.props.showLogin}>
            {'Remember your password?'}
          </a>
          <a href="#" onClick={this.props.showCreate}>
            {'Need to sign up?'}
          </a>
        </p>
      </div>
    );
  }
}

const ConnectedPasswordForgot = connect(
  PasswordForgot.mapStateToProps
)(PasswordForgot);
export default ConnectedPasswordForgot;
