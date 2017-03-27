import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Dialog } from 'components/backend';
import { Form } from 'components/global';
import { entityStoreActions } from 'actions';
import { usersAPI, requests, passwordsAPI } from 'api';
import { get } from 'lodash';

const { request, flush } = entityStoreActions;


class ResetPasswordWrapper extends PureComponent {

  static displayName = "ResetPassword.Confirm";

  static propTypes = {
    uiProps: PropTypes.shape({
      message: PropTypes.string,
      heading: PropTypes.heading,
      resolve: PropTypes.func.isRequired,
      reject: PropTypes.func.isRequired
    }).isRequired
  };

  static defaultProps = {
  };

  static mapStateToProps(state, ownProps) {
    return {
      response: get(state.entityStore.responses, requests.beUserUpdate)
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      confirm: false,
      password: '',
    };
    this.handleResolveClick = this.handleResolveClick.bind(this);
    this.handleRejectClick = this.handleRejectClick.bind(this);
  }

  componentWillUnmount() {
    this.props.dispatch(flush([requests.beUserUpdate]));
  }

  handleResolveClick() {
    this.props.uiProps.resolve();
  }

  handleRejectClick(event) {
    event.preventDefault();
    this.props.uiProps.reject();
  }

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
    const adjustPassword = !!this.state.password ? this.state.password : null;
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
    let errors = get(this.props.response, 'errors') || [];

    return (
      <form method="put" onSubmit={(event) => this.resetUserPassword(event, this.props.user)}>
        <div className="row-1-p">
          <Form.Errorable
            className="form-input"
            name="attributes[password]"
            errors={errors}
          >
            <label>New Password</label>
            <input
              value={this.state.password}
              onChange={(event) => this.handleInputChange(event)}
              name="password"
              type="password"
              id="reset-password"
              placeholder="New Password"
            />
          </ Form.Errorable>
        </div>
        <div className="row-1-p">
          <div className="form-input">
            <input
              className="button-secondary outlined button-with-room"
              type="submit"
              value="Reset Password"
            />
            <button
              className="button-secondary dull outlined"
              onClick={(event) => this.handleStateChange(event, 'editing', false)}
            >Cancel</button>
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

        { this.props.uiProps.message ?
          <p>
            {this.props.uiProps.message}
          </p>
          : null
        }
        { this.state.editing ?
          this.renderResetForm()
          :
          <div className="form-input">
            <button
              onClick={(event) => this.handleStateChange(event, 'confirm', true)}
              className="button-secondary outlined"
            >
              Generate new password
            </button>
            <button
              onClick={(event) => this.handleStateChange(event, 'editing', true)}
              className="button-secondary outlined"
            >
              Set new password
            </button>
            <button
              className="button-secondary dull outlined"
              onClick={(event) => this.handleRejectClick(event)}
            >Cancel</button>
          </div>
        }
      </div>
    );
  }

  renderConfirmation() {
    return (
      <div>
        <header className="dialog-header-small">
          <h2>Are you sure you want to reset this password?</h2>
        </header>
        <div className="buttons-icon-horizontal">
          <button
            onClick={(event) => this.handleResetEmailClick(event, this.props.user)}
            className="button-icon-secondary"
          >
            <i className="manicon manicon-check small"></i>
            Yes
          </button>
          <button
            className="button-icon-secondary"
            onClick={(event) => this.handleStateChange(event, 'confirm', false)}
          >
            <i className="manicon manicon-x small"></i>
            No
          </button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <Dialog.Wrapper
        className="dialog-reset"
        maxWidth={400}
        showCloseButton={false}
        closeOnOverlayClick={false}
      >
        { this.state.confirm ?
          this.renderConfirmation()
          : this.renderInitial()
        }
      </Dialog.Wrapper>
    );
  }

}

export default connect(
  ResetPasswordWrapper.mapStateToProps
)(ResetPasswordWrapper);
