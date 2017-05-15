import React, { Component, PropTypes } from 'react';
import connectAndFetch from 'utils/connectAndFetch';
import { passwordsAPI, requests } from 'api';
import { Form } from 'components/global';
import { entityStoreActions, notificationActions, currentUserActions } from 'actions';
import { get } from 'lodash';
import { select } from 'utils/entityUtils';
const { request, flush } = entityStoreActions;

export class PasswordResetContainer extends Component {

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
      this.props.match.params.resetToken
    );
    const changeRequest = request(action, requests.gPasswordReset);
    this.props.dispatch(changeRequest).promise.then((response) => {
      this.postUpdate(response.data);
    });
  }

  postUpdate(data) {
    this.loginUser(data);
    this.redirectToHome();
  }

  loginUser(user) {
    this.props.dispatch(currentUserActions.login({
      email: user.attributes.email,
      password: this.state.password
    }));
  }

  redirectToHome() {
    this.props.history.push('/');
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

export default connectAndFetch(PasswordResetContainer);
