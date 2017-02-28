import React, { Component, PropTypes } from 'react';
import { passwordsAPI, requests } from 'api';
import { Form } from 'components/global';
import { entityStoreActions, notificationActions, currentUserActions } from 'actions';
import { browserHistory } from 'react-router';
import { get } from 'lodash';
import { select } from 'utils/entityUtils';
import { connect } from 'react-redux';
const { request, flush } = entityStoreActions;

class PasswordReset extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    params: PropTypes.shape({
      resetToken: PropTypes.string
    }).isRequired,
    response: PropTypes.object
  };

  static mapStateToProps(state, ownProps) {
    return {
      response: get(state.entityStore.responses, requests.gPasswordReset)
    };
  }

  constructor() {
    super();
    this.state = {
      password: '',
      passwordConfirmation: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillUnmount() {
    this.props.dispatch(flush([requests.gPasswordReset]));
  }

  handleSubmit(event) {
    event.preventDefault(event.target);
    const action = passwordsAPI.update(
      this.state.password,
      this.state.passwordConfirmation,
      this.props.params.resetToken
    );
    const changeRequest = request(action, requests.gPasswordReset);
    this.props.dispatch(changeRequest).promise.then((response) => {
      this.postUpdate(response.data);
    });
  }

  postUpdate(data) {
    this.loginUser(data);
    this.createSuccessNotification();
    this.redirectToHome();
  }

  loginUser(user) {
    this.props.dispatch(currentUserActions.login({
      email: user.attributes.email,
      password: this.state.password
    }));
  }

  createSuccessNotification() {
    const notification = {
      level: 0,
      id: 'PASSWORD_RESET_SENT',
      heading: `Password updated.`
    };
    this.props.dispatch(notificationActions.addNotification(notification));
    setTimeout(() => {
      this.props.dispatch(notificationActions.removeNotification(notification.id));
    }, 5000);
  }

  redirectToHome() {
    browserHistory.push('/');
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    let errors = get(this.props.response, 'errors') || [];
    return (
      <section>
        <div className="container">
          <form method="post" onSubmit={(event) => this.handleSubmit(event)}>
            <h4 className="form-heading">Reset Password</h4>
            <div className="row-1-p">
            </div>
            <div className="row-1-p">
              <Form.Errorable
                className="form-input"
                name="attributes[password]"
                errors={errors}
              >
                <label>
                  New Password
                </label>
                <input
                  value={this.state.password}
                  type="password"
                  name="password"
                  id="reset-password"
                  onChange={this.handleInputChange}
                  placeholder="Password"
                />
              </Form.Errorable>
            </div>
            <div className="row-1-p">
              <Form.Errorable
                className="form-input"
                name="attributes[passwordConfirmation]"
                errors={errors}
              >
                <label>
                  Confirm Password
                </label>
                <input
                  value={this.state.passwordConfirmation}
                  type="password"
                  name="passwordConfirmation"
                  id="reset-password-confirmation"
                  onChange={this.handleInputChange}
                  placeholder="Confirm Password"
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

const PasswordResetContainer = connect(
  PasswordReset.mapStateToProps
)(PasswordReset);
export default PasswordResetContainer;
