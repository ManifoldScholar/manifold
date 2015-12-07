import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router';
import { startLogin } from '../../actions/shared/authentication';

class LoginForm extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    overlayVisible: PropTypes.bool,
    hideLoginOverlay: PropTypes.func,
    authentication: React.PropTypes.shape({
      authToken: React.PropTypes.string,
      user: React.PropTypes.object
    })
  };

  // By default, the visibility of the login overlay is false so this container can be used
  // outside of an overlay without any knowledge of the UI state
  static defaultProps = {
    overlayVisible: false
  };

  // TODO: Remove this at some future point
  state = {email: 'admin@manifold.dev', password: 'manifold'};

  updatePassword = (event) => {
    this.setState(Object.assign({}, this.state, {password: event.target.value}));
  };

  updateEmail = (event) => {
    this.setState(Object.assign({}, this.state, {email: event.target.value}));
  };

  handleLogin = (event) => {
    event.preventDefault();
    const { dispatch } = this.props;
    dispatch(startLogin(this.state.email, this.state.password));
    if (this.props.overlayVisible) {
      this.props.hideLoginOverlay();
    }
  };


  render = () => {
    return (
        <div>
          <form method="post" onSubmit={this.handleLogin} className="login-form">
            <div className="field">
              <label>
                Username
              </label>
              <input type="text" value={this.state.email} onChange={this.updateEmail} id="login-email" placeholder="Username" />
            </div>
            <div className="field">
              <label>
                Password
              </label>
              <input type="password" value={this.state.password} onChange={this.updatePassword} id="login-password" placeholder="Password" />
            </div>
            <input className="button-secondary" type="submit" value="Log in" />
          </form>
          <p className="login-links">
            <Link to="#">
              {'Forgot your password?'}
            </Link>
            <Link to="#">
              {'Need to sign up?'}
            </Link>
          </p>

          <section className="login-external">
            <button className="button-secondary-dull">
              <i className="manicon manicon-facebook"></i>
              <span>Log in with Facebook</span>
            </button>
            <button className="button-secondary-dull">
              <i className="manicon manicon-twitter"></i>
              <span>Log in with Twitter</span>
            </button>
          </section>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authentication: state.authentication
  };
}

export default connect(
    mapStateToProps
)(LoginForm);
