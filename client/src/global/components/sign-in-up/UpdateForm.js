import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation, Trans } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import { meAPI, requests } from "api";
import { entityStoreActions } from "actions";
import Form from "global/components/form";
import Avatar from "global/components/avatar";
import get from "lodash/get";
import hasIn from "lodash/hasIn";
import Dropzone from "react-dropzone";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";
import { UIDConsumer } from "react-uid";

const { request } = entityStoreActions;

export class UpdateFormContainer extends Component {
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
    history: PropTypes.object,
    mode: PropTypes.string,
    t: PropTypes.func
  };

  static defaultProps = {
    hideSignInUpOverlay: () => {}
  };

  constructor(props) {
    super(props);
    this.state = this.initialState(props);
    this.formRef = React.createRef();
  }

  componentDidMount() {
    if (this.formRef?.focus) this.formRef.focus();
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

  redirectToSubscriptions = event => {
    event.preventDefault();
    this.props.hideSignInUpOverlay();
    this.props.history.push(lh.link("subscriptions"));
  };

  renderProfileForm(errors) {
    const t = this.props.t;
    return (
      <div className="row-1-p">
        {this.props.mode === "new" ? (
          <div>
            <p className="overlay-copy">
              {t("forms.signin_overlay.familiar_name")}
            </p>
          </div>
        ) : (
          <div>
            <p className="overlay-copy" id="update-nickname-label">
              {t("forms.signin_overlay.update_nickname")}
            </p>
          </div>
        )}
        <div className="row-1-p">
          <Form.Errorable
            className="form-input"
            name="attributes[nickname]"
            errors={errors}
            idForError="update-nickname-error"
          >
            <input
              value={this.state.nickname}
              type="text"
              name="nickname"
              id="update-nickname"
              aria-labelledby="update-nickname-label"
              aria-describedby="update-nickname-error"
              onChange={this.handleInputChange}
              placeholder={t("forms.signin_overlay.nickname")}
            />
          </Form.Errorable>
        </div>
        {__BROWSER__ ? (
          <div className="row-1-p">
            {this.displayAvatar() ? null : (
              <p className="overlay-copy">
                {t("forms.signin_overlay.profile_img_instructions")}
              </p>
            )}
            <Form.Errorable
              className="form-input"
              idForError="avatar-update-error"
              name="attributes[avatar]"
              errors={errors}
            >
              <label htmlFor="avatar-update" className="screen-reader-text">
                {t("forms.signin_overlay.profile_img")}
              </label>
              <Dropzone onDrop={this.handleFileDrop}>
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps({
                      className: "form-dropzone",
                      tabIndex: null
                    })}
                  >
                    <input
                      {...getInputProps({
                        accept: "image/*",
                        multiple: false,
                        id: "avatar-update",
                        "aria-describedby": "avatar-update-error",
                        tabIndex: 0
                      })}
                    />
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
                        {this.hasAvatar() && (
                          <button
                            onClick={this.handleRemoveAvatar}
                            tabIndex="0"
                            className="dropzone-button__cancel-button"
                          >
                            <IconComposer icon="close16" size="default" />
                            <span className="screen-reader-text">
                              {t("forms.signin_overlay.remove_avatar")}
                            </span>
                          </button>
                        )}
                        <Avatar
                          style={{ margin: 0 }}
                          url={this.displayAvatar()}
                        />
                      </div>
                      <span className="dropzone-button__text">
                        <Trans
                          i18nKey="forms.signin_overlay.upload_avatar_instructions"
                          components={[
                            <span className="form-dropzone__upload-prompt" />
                          ]}
                        />
                      </span>
                    </div>
                  </div>
                )}
              </Dropzone>
            </Form.Errorable>
          </div>
        ) : null}
        <div className="row-1-p">
          <p className="overlay-copy">
            {t("forms.signin_overlay.edit_account")}
          </p>
          <Form.Errorable
            className="form-input"
            name="attributes[firstName]"
            errors={errors}
            idForError="update-firstName-error"
          >
            <label htmlFor="update-firstName">
              {t("forms.signin_overlay.first_name")}
            </label>
            <input
              value={this.state.firstName}
              type="text"
              name="firstName"
              id="update-firstName"
              aria-describedby="update-firstName-error"
              onChange={this.handleInputChange}
              placeholder={t("forms.signin_overlay.first_name")}
            />
          </Form.Errorable>
          <Form.Errorable
            className="form-input"
            name="attributes[lastName]"
            errors={errors}
            idForError="update-lastName-error"
          >
            <label htmlFor="update-lastName">
              {t("forms.signin_overlay.last_name")}
            </label>
            <input
              value={this.state.lastName}
              type="text"
              name="lastName"
              id="update-lastName"
              aria-describedby="update-lastName-error"
              onChange={this.handleInputChange}
              placeholder={t("forms.signin_overlay.last_name")}
            />
          </Form.Errorable>
          <Form.Errorable
            className="form-input"
            name="attributes[email]"
            errors={errors}
            idForError="update-email-error"
          >
            <label htmlFor="update-email">
              {t("forms.signin_overlay.email")}
            </label>
            <input
              value={this.state.email}
              type="text"
              name="email"
              id="update-email"
              aria-describedby="update-email-error"
              onChange={this.handleInputChange}
              placeholder={t("forms.signin_overlay.email")}
            />
          </Form.Errorable>
          <Form.Errorable
            className="form-input"
            name="attributes[password]"
            errors={errors}
            idForError="update-password-error"
          >
            <label htmlFor="update-password">
              {t("forms.signin_overlay.password")}
            </label>
            <input
              value={this.state.password}
              type="password"
              name="password"
              id="update-password"
              aria-describedby="update-password-error"
              onChange={this.handleInputChange}
              placeholder={t("forms.signin_overlay.new_password")}
            />
          </Form.Errorable>
          <Form.Errorable
            className="form-input"
            name="attributes[passwordConfirmation]"
            errors={errors}
            idForError="update-passwordConfirmation-error"
          >
            <label htmlFor="update-passwordConfirmation">
              {t("forms.signin_overlay.confirm_password")}
            </label>
            <input
              value={this.state.passwordConfirmation}
              type="password"
              name="passwordConfirmation"
              id="update-passwordConfirmation"
              aria-describedby="update-passwordConfirmation-error"
              onChange={this.handleInputChange}
              placeholder={t("forms.signin_overlay.confirm_new_password")}
            />
          </Form.Errorable>
        </div>
      </div>
    );
  }

  render() {
    const errors = get(this.props.response, "errors") || [];
    const currentUser = this.props.authentication.currentUser;
    if (!currentUser) return null;
    const t = this.props.t;
    return (
      <section className="sign-in-up-update">
        <UIDConsumer>
          {id => (
            <form
              autoComplete="off"
              method="post"
              onSubmit={this.updateUser}
              tabIndex={-1}
              ref={el => (this.formRef = el)}
              aria-labelledby={id}
            >
              <h2 id={id} className="screen-reader-text">
                {t("forms.signin_overlay.update_sr_title")}
              </h2>
              {this.props.mode === "new" ? (
                <div>
                  <Trans
                    i18nKey="forms.signin_overlay.create_success_message"
                    components={[
                      <h4 className="form-heading" />,
                      <p className="overlay-copy" />,
                      <h4 className="nickname" />
                    ]}
                    values={{ name: this.displayNickname() }}
                  />
                </div>
              ) : (
                <div>
                  <h4 className="form-heading">
                    <Trans
                      i18nKey="forms.signin_overlay.greeting"
                      components={[<span className="nickname" />]}
                      values={{ name: this.displayNickname() }}
                    />
                  </h4>
                </div>
              )}
              {this.renderProfileForm(errors)}
              <div className="row-1-p">
                <div className="form-input form-error">
                  <input
                    className="button-secondary button-secondary--with-room"
                    type="submit"
                    value={t("forms.signin_overlay.submit_update_label")}
                  />
                </div>
              </div>
            </form>
          )}
        </UIDConsumer>

        <div className="subscriptions">
          <span className="subscriptions__label">
            {t("forms.signin_overlay.subscriptions__label")}
          </span>
          <button
            className="button-secondary button-secondary--outlined button-secondary--color-white"
            onClick={this.redirectToSubscriptions}
          >
            <span className="button-secondary__text">
              {t("forms.signin_overlay.notification_settings")}
            </span>
            <IconComposer
              icon="arrowLongRight16"
              size="default"
              className="button-secondary__icon"
            />
          </button>
        </div>
      </section>
    );
  }
}

export default withTranslation()(connectAndFetch(UpdateFormContainer));
