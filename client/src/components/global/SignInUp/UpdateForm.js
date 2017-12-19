import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { meAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { Avatar, Form } from "components/global";
import get from "lodash/get";
import hasIn from "lodash/hasIn";
import startCase from "lodash/startCase";
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

  constructor() {
    super();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.handleFileDrop = this.handleFileDrop.bind(this);
    this.handleRemoveAvatar = this.handleRemoveAvatar.bind(this);
    this.doUpdateRequest = this.doUpdateRequest.bind(this);
    this.displayAvatar = this.displayAvatar.bind(this);
    this.displayNickname = this.displayNickname.bind(this);
    this.placeholderAttribute = this.placeholderAttribute.bind(this);
    this.hasAvatar = this.hasAvatar.bind(this);

    this.state = {
      nickname: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      removeAvatar: false,
      avatar: null
    };
  }

  setParams() {
    const params = {};
    Object.keys(this.state).forEach(key => {
      if (key === "removeAvatar" || key === "avatar") return null;
      if (key === "password" && this.state.password === "") return null;
      params[key] = this.placeholderAttribute(key);
    });
    return params;
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  doUpdateRequest(avatarData = null) {
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
  }

  updateUser(event) {
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
  }

  hasAvatar() {
    return !!this.displayAvatar();
  }

  handleRemoveAvatar(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ avatar: null, removeAvatar: true });
  }

  handleFileDrop(file) {
    this.setState({ avatar: file[0], removeAvatar: false });
  }

  displayAvatar() {
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
  }

  displayNickname() {
    if (this.state.nickname) return this.state.nickname;
    if (hasIn(this.props.authentication, "currentUser.attributes.nickname")) {
      return this.props.authentication.currentUser.attributes.nickname;
    }
    if (hasIn(this.props.authentication, "currentUser.attributes.firstName")) {
      return this.props.authentication.currentUser.attributes.firstName;
    }
  }

  placeholderAttribute(attribute) {
    if (this.state[attribute].length) return this.state[attribute];
    if (
      hasIn(this.props.authentication, `currentUser.attributes[${attribute}]`)
    ) {
      return this.props.authentication.currentUser.attributes[attribute];
    }
    return startCase(attribute);
  }

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
        {this.props.mode === "new"
          ? <div>
              <h4 className="form-heading">Congratulations!</h4>
              <p className="overlay-copy">
                {`Your account has been successfully created and you are now
                logged in to Manifold. From now on, I'm going to call you`}
              </p>
              <h4 className="nickname">
                {this.displayNickname()}
              </h4>
              <p className="overlay-copy">
                Would you like me to call you something else?
              </p>
            </div>
          : <div>
              <h4 className="form-heading">
                Hello,{" "}
                <span className="nickname">{this.displayNickname()}</span>.
              </h4>
              <p className="overlay-copy">
                Would you like to update your Nickname?
              </p>
            </div>}
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
              onChange={this.handleInputChange}
              placeholder={this.placeholderAttribute("nickname")}
            />
          </Form.Errorable>
        </div>
        {__CLIENT__
          ? <div className="row-1-p">
              {this.displayAvatar()
                ? null
                : <p className="overlay-copy">
                    {"While you're here, why not upload a profile image?"}
                  </p>}
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
                      {this.hasAvatar()
                        ? <i
                            onClick={this.handleRemoveAvatar}
                            style={{
                              position: "absolute",
                              top: 0,
                              right: -8,
                              fontSize: 10
                            }}
                            className="manicon manicon-x"
                          />
                        : null}
                      <Avatar
                        style={{ margin: 0 }}
                        url={this.displayAvatar()}
                      />
                    </div>
                    <span className="dropzone-button-text">
                      Click to browse or<br />drag and drop
                    </span>
                  </div>
                </Dropzone>
              </Form.Errorable>
            </div>
          : null}
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
              placeholder={this.placeholderAttribute("firstName")}
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
              placeholder={this.placeholderAttribute("lastName")}
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
              placeholder={this.placeholderAttribute("email")}
            />
          </Form.Errorable>
          <Form.Errorable
            className="form-input"
            name="attributes[password]"
            errors={errors}
          >
            <label>Password</label>
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
            <label>Confirm Password</label>
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
