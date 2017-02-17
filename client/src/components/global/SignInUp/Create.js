import React, { Component, PropTypes } from 'react';
import { usersAPI } from 'api';
import { entityStoreActions, currentUserActions } from 'actions';
import { select } from 'utils/entityUtils';
import { Form } from 'components/global';

import { connect } from 'react-redux';
import get from 'lodash/get';

const { request, flush } = entityStoreActions;

// const { startLogin } = authActions;

class Create extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    response: PropTypes.object,
    user: PropTypes.object,
    showForgot: PropTypes.func.isRequired,
    showLogin: PropTypes.func.isRequired,
    showCreateUpdate: PropTypes.func.isRequired
  };

  static requests = {
    create: 'signinup-create-user'
  };

  static mapStateToProps(state) {
    const r = Create.requests;
    const myState = {
      user: select(r.create, state.entityStore),
      response: state.entityStore.responses[r.create]
    };
    return myState;
  }

  constructor() {
    super();
    this.createUser = this.createUser.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.authenticateUser = this.authenticateUser.bind(this);
    this.state = {
      authenticating: false,
      user: {
        email: '',
        name: '',
        password: '',
        passwordConfirmation: ''
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && !this.props.user) {
      this.authenticateUser();
    }
    if (nextProps.authentication.authenticated) {
      this.props.showCreateUpdate();
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush(Create.requests));
  }

  authenticateUser() {
    this.setState({ authenticating: true });
    const { dispatch } = this.props;
    dispatch(currentUserActions.login({
      email: this.state.user.email,
      password: this.state.user.password
    }));
  }

  createUser(event) {
    event.preventDefault(event.target);
    this.props.dispatch(request(usersAPI.create(this.state.user), Create.requests.create));
  }

  handleInputChange(event) {
    const user =
      Object.assign({}, this.state.user, { [event.target.name]: event.target.value });
    this.setState({ user });
  }

  render() {
    let errors = get(this.props.response, 'errors') || [];
    return (
      <div>
        <form method="post" onSubmit={this.createUser} >
          <h4 className="form-heading">Create Account</h4>
          <div className="row-1-p">
            <Form.Errorable
              className="form-input"
              name="attributes[email]"
              errors={errors}
            >
             <label>Email</label>
              <input
                value={this.state.user.email}
                type="text"
                name="email"
                id="create-email"
                onChange={this.handleInputChange}
                placeholder="Email"
              />
            </Form.Errorable>
          </div>
          <div className="row-1-p">
            <Form.Errorable
              className="form-input"
              name={['attributes[firstName]', 'attributes[lastName]']}
              errors={errors}
            >
              <label>
                Name
              </label>
              <input
                value={this.state.user.name}
                type="text"
                id="create-name"
                name="name"
                onChange={this.handleInputChange}
                placeholder="Name"
              />
            </Form.Errorable>
          </div>
          <div className="row-1-p">
            <Form.Errorable
              className="form-input"
              name="attributes[password]"
              errors={errors}
            >
              <label>
                Password
              </label>
              <input
                value={this.state.user.password}
                type="password"
                name="password"
                id="create-password"
                onChange={this.handleInputChange}
                placeholder="Password"
              />
            </Form.Errorable>
          </div>
          <div className="row-1-p">
            <div className="form-input">
              <label>
                Confirm Password
              </label>
              <input
                value={this.state.user.passwordConfirmation}
                type="password"
                name="passwordConfirmation"
                id="create-password-confirmation"
                onChange={this.handleInputChange}
                placeholder="Confirm Password"
              />
            </div>
          </div>
          <div className="row-1-p">
            <div className="form-input">
              <input
                className="button-secondary button-with-room"
                type="submit"
                value="Create Account"
              />
            </div>
          </div>
        </form>
        <p className="login-links">
          {'You can also create a Manifold account using your Facebook or Twitter credentials.'}
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
        <p className="login-links">
          <a href="#" onClick={this.props.showLogin}>
            {'Already have an account?'}
          </a>
        </p>
        <p className="login-links">
          {'By creating this account, you agree to Manifold\'s terms and conditions.'}
        </p>

      </div>
    );
  }
}

const SignUpCreate = connect(
  Create.mapStateToProps
)(Create);
export default SignUpCreate;
