import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import Dialog from "backend/components/dialog";
import withConfirmation from "hoc/with-confirmation";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { usersAPI, requests } from "api";
import Form from "backend/components/form";
import FormContainer from "backend/containers/form";
import get from "lodash/get";
import lh from "helpers/linkHandler";
import Navigation from "backend/components/navigation";

const { request, flush } = entityStoreActions;

export class UsersEditContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      user: select(requests.beUser, state.entityStore),
      createMakerResponse: get(
        state.entityStore.responses,
        requests.beMakerCreate
      )
    };
  };

  static displayName = "Users.Edit";

  static propTypes = {
    match: PropTypes.object,
    confirm: PropTypes.func.isRequired,
    dispatch: PropTypes.func,
    user: PropTypes.object,
    history: PropTypes.object
  };

  static defaultProps = {
    confirm: (heading, message, callback) => callback()
  };

  constructor(props) {
    super(props);
    this.state = {
      resetPassword: null
    };
  }

  componentDidMount() {
    this.fetchUser(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchUser(this.props.match.params.id);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush([requests.beUserUpdate, requests.beMakerCreate]));
  }

  get user() {
    return this.props.user;
  }

  fetchUser(id) {
    const call = usersAPI.show(id);
    const userRequest = request(call, requests.beUser);
    this.props.dispatch(userRequest);
  }

  handleUserDestroy = () => {
    const heading = "Are you sure you want to delete this user?";
    const message = "This action cannot be undone.";
    this.props.confirm(heading, message, this.destroyUser);
  };

  destroyUser = () => {
    const user = this.user;
    const call = usersAPI.destroy(user.id);
    const options = { removes: user };
    const userRequest = request(call, requests.beUserDestroy, options);
    this.props.dispatch(userRequest).promise.then(() => {
      this.props.history.push(lh.link("backendRecordsUsers"));
    });
  };

  unsubscribeUser = () => {
    const heading = "Are you sure?";
    const message =
      "This user will be unsubscribed from all Manifold email notifications.";
    this.props.confirm(heading, message, () => {
      const adjustedUser = Object.assign({}, this.user);
      adjustedUser.attributes.unsubscribe = true;

      const call = usersAPI.update(this.user.id, adjustedUser);
      const options = { notificationScope: "drawer" };
      const userRequest = request(call, requests.beUserUpdate, options);
      return this.props.dispatch(userRequest);
    });
  };

  closeResetDialog() {
    this.setState({ resetPassword: null });
  }

  handleResetPasswordClick = () => {
    const heading = "How would you like to reset the user's password?";
    const message =
      "Automatically send the user a new password or set one yourself.";
    new Promise((resolve, reject) => {
      this.setState({
        resetPassword: { resolve, reject, heading, message }
      });
    }).then(
      () => {
        this.closeResetDialog();
      },
      () => {
        this.closeResetDialog();
      }
    );
  };

  render() {
    if (!this.user) return null;
    const attr = this.user.attributes;
    const user = this.user;

    return (
      <div>
        {this.state.resetPassword ? (
          <Dialog.ResetPassword
            uiProps={this.state.resetPassword}
            {...this.props}
          />
        ) : null}

        <Navigation.DrawerHeader
          title={`${attr.firstName} ${attr.lastName}`}
          buttons={[
            {
              onClick: this.handleResetPasswordClick,
              icon: "key32",
              label: "Reset Password"
            },
            {
              onClick: this.unsubscribeUser,
              icon: "mail32",
              label: "Unsubscribe"
            },
            {
              onClick: this.handleUserDestroy,
              icon: "delete32",
              label: "Delete",
              iconClass: "notice"
            }
          ]}
        />

        <section className="form-section">
          <FormContainer.Form
            model={this.user}
            name={requests.beUserUpdate}
            update={usersAPI.update}
            create={usersAPI.create}
            className="form-secondary"
            notificationScope="drawer"
          >
            <Form.TextInput
              focusOnMount
              label="Email"
              name="attributes[email]"
              placeholder="Email"
            />
            <Form.TextInput
              label="First Name"
              name="attributes[firstName]"
              placeholder="First Name"
            />
            <Form.TextInput
              label="Last Name"
              name="attributes[lastName]"
              placeholder="Last Name"
            />
            <Form.Select
              label="Role"
              name="attributes[role]"
              selected={user.attributes.role}
              options={[
                { label: "Admin", value: "admin" },
                { label: "Editor", value: "editor" },
                { label: "Project Creator", value: "project_creator" },
                { label: "Marketeer", value: "marketeer" },
                { label: "Reader", value: "reader" }
              ]}
            />
            <Form.Save text="Save User" />
          </FormContainer.Form>
        </section>
      </div>
    );
  }
}

export default withConfirmation(connectAndFetch(UsersEditContainer));
