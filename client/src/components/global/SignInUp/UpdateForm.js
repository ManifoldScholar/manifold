import React, { Component, PropTypes } from 'react';
import { meAPI } from 'api';
import { entityStoreActions } from 'actions';
import { Avatar, Form } from 'components/global';
import { connect } from 'react-redux';
import get from 'lodash/get';
import hasIn from 'lodash/hasIn';
import Dropzone from 'react-dropzone';

const { request, requests } = entityStoreActions;

class UpdateForm extends Component {

  static mapStateToProps(state) {
    return {
      response: state.entityStore.responses[requests.updateCurrentUser]
    };
  }

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
    this.placeholderNickname = this.placeholderNickname.bind(this);
    this.hasAvatar = this.hasAvatar.bind(this);

    this.state = {
      nickname: '',
      removeAvatar: false,
      avatar: null
    };
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  doUpdateRequest(avatarData = null) {
    const params = {
      nickname: this.displayNickname(),
      removeAvatar: this.state.removeAvatar
    };
    if (avatarData) {
      params.avatar = {
        data: avatarData,
        content_type: this.state.avatar.type,
        filename: this.state.avatar.name
      };
    }
    const { promise } =
      this.props.dispatch(request(meAPI.update(params), requests.updateCurrentUser));
    promise.then(() => {
      this.props.hideSignInUpOverlay();
    });
  }

  updateUser(event) {
    event.preventDefault();
    if (this.state.avatar) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = reader.result;
        this.doUpdateRequest(data);
      };
      reader.readAsDataURL(this.state.avatar);
    } else {
      this.doUpdateRequest();
    }
  }

  hasAvatar() {
    return this.displayAvatar() ? true : false;
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
    if (hasIn(this.state, 'avatar.preview')) return this.state.avatar.preview;
    if (hasIn(this.props, 'authentication.currentUser.attributes.avatarUrl')) {
      return this.props.authentication.currentUser.attributes.avatarUrl;
    }
    return null;
  }

  displayNickname() {
    if (this.state.nickname) return this.state.nickname;
    if (hasIn(this.props.authentication, 'currentUser.attributes.nickname')) {
      return this.props.authentication.currentUser.attributes.nickname;
    }
    if (hasIn(this.props.authentication, 'currentUser.attributes.firstName')) {
      return this.props.authentication.currentUser.attributes.firstName;
    }
  }

  placeholderNickname() {
    if (this.state.nickname) return this.state.nickname;
    if (hasIn(this.props.authentication, 'currentUser.attributes.nickname')) {
      return this.props.authentication.currentUser.attributes.nickname;
    }
    return 'Nickname';
  }

  render() {
    let errors = get(this.props.response, 'errors') || [];
    if (!this.props.authentication.currentUser) return null;
    return (
      <form
        autoComplete="off"
        className="sign-in-up-update"
        method="post"
        onSubmit={this.updateUser}
      >
        {this.props.mode === "new" ?
          <div>
            <h4 className="form-heading">Congratulations!</h4>
            <p className="overlay-copy">
              Your account has been successfully created and you are now logged in to
              Manifold. From now on, I'm going to call you
            </p>
            <h4 className="nickname">{this.displayNickname()}</h4>
            <p className="overlay-copy">
              Would you like me to call you something else?
            </p>
          </div>
        :
          <div>
            <h4 className="form-heading">
              Hello, <span className="nickname">{this.displayNickname()}</span>.
            </h4>
            <p className="overlay-copy">
              Would you like to update your Nickname?
            </p>
          </div>
        }
        <div className="row-1-p">
          <Form.Errorable
            className="form-input"
            name="attribuets[nickname]"
            errors={errors}
          >
            <input
              value={this.state.nickname}
              type="text"
              name="nickname"
              id="update-nickname"
              onChange={this.handleInputChange}
              placeholder="Nickname"
            />
          </Form.Errorable>
        </div>
        <div className="row-1-p">
          <p className="overlay-copy">
            While you're here, why not upload a profile image?
          </p>
          <Dropzone
            className="form-dropzone"
            style={{}}
            activeStyle={{}}
            accept="image/*"
            multiple={false}
            ref="dropzone"
            onDrop={this.handleFileDrop}
          >
            <div
              style={{ position: 'relative' }}
              className="dropzone-button dropzone-button-dotted"
            >
              <div
                style={{ top: '50%', marginTop: -33, height: 66, width: 66, position: 'absolute' }}
              >
                { this.hasAvatar() ?
                  <i
                    onClick={this.handleRemoveAvatar}
                    style={{ position: 'absolute', top: 0, right: -8, fontSize: 10 }}
                    className="manicon manicon-x"
                  />
                : null}
                <Avatar style={{ margin: 0 }} url={this.displayAvatar()} />
              </div>
              <span className="dropzone-button-text">Click to browse or<br />
              drag and drop</span>
            </div>
          </Dropzone>
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

const ConnectedUpdateForm = connect(
  UpdateForm.mapStateToProps
)(UpdateForm);
export default ConnectedUpdateForm;
