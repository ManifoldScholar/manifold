import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { meAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { Avatar, Form } from "components/global";
import get from "lodash/get";
import hasIn from "lodash/hasIn";
import Dropzone from "react-dropzone";

const { request } = entityStoreActions;

class UpdateFormContainer extends Component {
  static mapStateToProps = state => {
    return {
      response: state.entityStore.responses[requests.gAuthenticatedUserUpdate]
    };
  };

  static propTypes = {
    dispatch: PropTypes.func,
    response: PropTypes.object,
    authentication: PropTypes.object,
    hideSignInUpOverlay: PropTypes.func,
    mode: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = this.initialState(props);
  }

  componentDidUpdate(prevProps) {
    // If user is newly created, set state after authentication is complete in store
    if (
      !this.props.authentication.authenticating &&
      prevProps.authentication.authenticating
    ) {
      this.setState(this.initialState(this.props));
    }
  }

  setParams() {
    const params = {};
    Object.keys(this.state).forEach(key => {
      if (key === "removeAvatar" || key === "avatar") return null;
      if (key === "password" && this.state.password === "") return null;
      params[key] = this.state[key];
    });
    return params;
  }

  initialState(props) {
    return {
      nickname: this.currentUserAttribute(props, "nickname"),
      firstName: this.currentUserAttribute(props, "firstName"),
      lastName: this.currentUserAttribute(props, "lastName"),
      email: this.currentUserAttribute(props, "email"),
      password: "",
      passwordConfirmation: "",
      removeAvatar: false,
      avatar: null
    };
  }

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  doUpdateRequest = (avatarData = null) => {
    const params = this.setParams();
    params.removeAvatar = this.state.removeAvatar;
    if (avatarData) {
      params.avatar = {
        data: avatarData,
        content_type: this.state.avatar.type,
        filename: this.state.avatar.name
      };
    }
    const { promise } = this.props.dispatch(
      request(meAPI.update(params), requests.gAuthenticatedUserUpdate)
    );
    promise.then(() => {
      this.props.hideSignInUpOverlay();
    });
  };

  updateUser = event => {
    event.preventDefault();
    if (this.state.avatar) {
      const reader = new FileReader();
      reader.onload = eIgnored => {
        const data = reader.result;
        this.doUpdateRequest(data);
      };
      reader.readAsDataURL(this.state.avatar);
    } else {
      this.doUpdateRequest();
    }
  };

  hasAvatar = () => {
    return !!this.displayAvatar();
  };

  handleRemoveAvatar = event => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ avatar: null, removeAvatar: true });
  };

  handleFileDrop = file => {
    this.setState({ avatar: file[0], removeAvatar: false });
  };

  displayAvatar = () => {
    if (this.state.removeAvatar) return null;
    if (hasIn(this.state, "avatar.preview")) return this.state.avatar.preview;
    if (
      hasIn(
        this.props,
        "authentication.currentUser.attributes.avatarStyles.smallSquare"
      )
    ) {
      return this.props.authentication.currentUser.attributes.avatarStyles
        .smallSquare;
    }
    return null;
  };

  displayNickname = () => {
    if (this.state.nickname) return this.state.nickname;
    if (hasIn(this.props.authentication, "currentUser.attributes.nickname")) {
      return this.props.authentication.currentUser.attributes.nickname;
    }
    if (hasIn(this.props.authentication, "currentUser.attributes.firstName")) {
      return this.props.authentication.currentUser.attributes.firstName;
    }
  };

  currentUserAttribute = (props, attribute) => {
    if (!props.authentication.currentUser) return "";
    if (hasIn(props.authentication, `currentUser.attributes[${attribute}]`)) {
      return props.authentication.currentUser.attributes[attribute];
    }
    return "";
  };

  render() {
    const errors = get(this.props.response, "errors") || [];
    if (!this.props.authentication.currentUser) return null;
    return (
      <form
        autoComplete="off"
        className="sign-in-up-update"
        method="post"
        onSubmit={this.updateUser}
      >
        {this.props.mode === "new" ? (
          <div>
            <h4 className="form-heading">Congratulations!</h4>
            <p className="overlay-copy">
              {`Your account has been successfully created and you are now
                logged in to Manifold. From now on, I'm going to call you`}
            </p>
            <h4 className="nickname">{this.displayNickname()}</h4>
            <p className="overlay-copy">
              Would you like me to call you something else?
            </p>
          </div>
        ) : (
          <div>
            <h4 className="form-heading">
              Hello, <span className="nickname">{this.displayNickname()}</span>.
            </h4>
            <p className="overlay-copy" id="update-nickname-label">
              Would you like to update your Nickname?
            </p>
          </div>
        )}
        <div className="row-1-p">
          <Form.Errorable
            className="form-input"
            name="attributes[nickname]"
            errors={errors}
          >
            <input
              value={this.state.nickname}
              type="text"
              name="nickname"
              id="update-nickname"
              aria-labelledby="update-nickname-label"
              onChange={this.handleInputChange}
              placeholder="Nickname"
            />
          </Form.Errorable>
        </div>
        {__CLIENT__ ? (
          <div className="row-1-p">
            {this.displayAvatar() ? null : (
              <p className="overlay-copy">
                {"While you're here, why not upload a profile image?"}
              </p>
            )}
            <Form.Errorable
              className="form-input"
              name="attributes[avatar]"
              errors={errors}
            >
              <Dropzone
                className="form-dropzone"
                style={{}}
                activeStyle={{}}
                accept="image/*"
                multiple={false}
                ref={dropzone => {
                  this.dropzone = dropzone;
                }}
                onDrop={this.handleFileDrop}
              >
                <div
                  style={{ position: "relative" }}
                  className="dropzone-button dropzone-button-dotted"
                >
                  <div
                    style={{
                      top: "50%",
                      marginTop: -33,
                      height: 66,
                      width: 66,
                      position: "absolute"
                    }}
                  >
                    {this.hasAvatar() ? (
                      <i
                        onClick={this.handleRemoveAvatar}
                        role="button"
                        style={{
                          position: "absolute",
                          top: 0,
                          right: -8,
                          fontSize: 10
                        }}
                        className="manicon manicon-x"
                      />
                    ) : null}
                    <Avatar style={{ margin: 0 }} url={this.displayAvatar()} />
                  </div>
                  <span className="dropzone-button-text">
                    Click to browse or<br />drag and drop
                  </span>
                </div>
              </Dropzone>
            </Form.Errorable>
          </div>
        ) : null}
        <div className="row-1-p">
          <p className="overlay-copy">
            Do you want to edit your account information?
          </p>
          <Form.Errorable
            className="form-input"
            name="attributes[firstName]"
            errors={errors}
          >
            <label>First Name</label>
            <input
              value={this.state.firstName}
              type="text"
              name="firstName"
              id="update-firstName"
              onChange={this.handleInputChange}
              placeholder="First name"
            />
          </Form.Errorable>
          <Form.Errorable
            className="form-input"
            name="attributes[lastName]"
            errors={errors}
          >
            <label>Last Name</label>
            <input
              value={this.state.lastName}
              type="text"
              name="lastName"
              id="update-lastName"
              onChange={this.handleInputChange}
              placeholder="Last name"
            />
          </Form.Errorable>
          <Form.Errorable
            className="form-input"
            name="attributes[email]"
            errors={errors}
          >
            <label>Email</label>
            <input
              value={this.state.email}
              type="text"
              name="email"
              id="update-email"
              onChange={this.handleInputChange}
              placeholder="Email"
            />
          </Form.Errorable>
          <Form.Errorable
            className="form-input"
            name="attributes[password]"
            errors={errors}
          >
            <label htmlFor="update-password">Password</label>
            <input
              value={this.state.password}
              type="password"
              name="password"
              id="update-password"
              onChange={this.handleInputChange}
              placeholder="New password"
            />
          </Form.Errorable>
          <Form.Errorable
            className="form-input"
            name="attributes[passwordConfirmation]"
            errors={errors}
          >
            <label htmlFor="update-passwordConfirmation">
              Confirm Password
            </label>
            <input
              value={this.state.passwordConfirmation}
              type="password"
              name="passwordConfirmation"
              id="update-passwordConfirmation"
              onChange={this.handleInputChange}
              placeholder="Confirm new password"
            />
          </Form.Errorable>
        </div>
        <div className="row-1-p">
          <div className="form-input form-error">
            <input
              className="button-secondary button-with-room"
              type="submit"
              value="Save Changes"
            />
          </div>
        </div>
      </form>
    );
  }
}

export default connectAndFetch(UpdateFormContainer);
