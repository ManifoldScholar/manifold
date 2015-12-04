import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { LoginForm } from './';
import { startLogout } from '../../actions/shared/authentication';

class Login extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    authentication: React.PropTypes.shape({
      authToken: React.PropTypes.string,
      user: React.PropTypes.object
    })
  };

  handleLogout = (event) => {
    event.preventDefault();
    const { dispatch } = this.props;
    dispatch(startLogout());
  };

  loginUI = () => {
    return (
      <div className="container">
        <header className="rel">
          <h4 className="section-heading">
            <i className="manicon manicon-lamp"></i>
            {'Logout'}
          </h4>
        </header>
        <LoginForm />
      </div>
    );
  };

  // TODO: Abstract logout UI into separate container for reusability as well
  logoutUI = () => {
    return (
      <div className="container">
        <header className="rel">
          <h4 className="section-heading">
            <i className="manicon manicon-lamp"></i>
            {'Logout'}
          </h4>
        </header>
        <form method="post" onSubmit={this.handleLogout}>
          { this.props.authentication.user ? <div style={{marginBottom: 20}}>{`You are logged in as ${this.props.authentication.user.email}`}</div> : ''}
          <input type="submit" value="Logout" />
        </form>
      </div>
    );
  };

  render = () => {
    return (
      <section>
        {this.props.authentication.authToken === null ? this.loginUI() : this.logoutUI()}
      </section>
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
)(Login);
