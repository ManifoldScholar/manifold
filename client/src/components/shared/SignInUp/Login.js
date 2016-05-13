import React, { Component, PropTypes } from 'react';
import { startLogin } from '../../../actions/shared/authentication';


export default class Login extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    showForgot: PropTypes.func.isRequired,
    showCreate: PropTypes.func.isRequired,
    authentication: React.PropTypes.shape({
      authToken: React.PropTypes.string,
      user: React.PropTypes.object
    })
  };

  constructor() {
    super();
    this.updatePassword = this.updatePassword.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.authenticationError = this.authenticationError.bind(this);
  }

  // TODO: Remove this at some future point
  state = { email: 'admin@manifold.dev', password: 'manifold' };

  updatePassword = (event) => {
    this.setState(Object.assign({}, this.state, { password: event.target.value }));
  };

  updateEmail = (event) => {
    this.setState(Object.assign({}, this.state, { email: event.target.value }));
  };

  handleLogin = (event) => {
    event.preventDefault();
    const { dispatch } = this.props;
    dispatch(startLogin(this.state.email, this.state.password));
  };

  authenticationError() {
  }

  render() {
    return (
      <div>
        {this.authenticationError()}
        <form method="post" onSubmit={this.handleLogin} >
          <div className="row-1-p">
            <div className="form-input form-error">
              <label>Email</label>
              <input
                type="text"
                value={this.state.email}
                onChange={this.updateEmail}
                id="login-email"
                placeholder="Username"
              />
            </div>
          </div>
          <div className="row-1-p">
            <div className="form-input">
              <label>Password</label>
              <input
                type="password"
                value={this.state.password}
                onChange={this.updatePassword}
                id="login-password"
                placeholder="Password"
              />
            </div>
          </div>
          <div className="row-1-p">
            <div className="form-input form-error">
              <input
                className="button-secondary button-with-room"
                type="submit"
                value="Log in"
              />
            </div>
          </div>
        </form>
        <p className="login-links">
          <a href="#" onClick={this.props.showForgot}>
            {'Forgot your password?'}
          </a>
          <a href="#" onClick={this.props.showCreate}>
            {'Need to sign up?'}
          </a>
        </p>

        <section className="login-external">
          <button className="button-secondary-dark">
            <i className="manicon manicon-facebook"></i>
            <span>Log in with Facebook</span>
          </button>
          <button className="button-secondary-dark">
            <i className="manicon manicon-twitter"></i>
            <span>Log in with Twitter</span>
          </button>
        </section>
      </div>
    );
  }
}
