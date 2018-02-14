import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Dialog } from "components/backend";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { usersAPI, makersAPI, requests } from "api";
import { Form } from "components/backend";
import { Form as FormContainer } from "containers/backend";
import get from "lodash/get";
import lh from "helpers/linkHandler";

const { request, flush } = entityStoreActions;

export class UsersEditContainer extends PureComponent {
  static displayName = "Users.Edit";

  static propTypes = {
    match: PropTypes.object,
    dispatch: PropTypes.func,
    user: PropTypes.object,
    history: PropTypes.object
  };

  static mapStateToProps = state => {
    return {
      user: select(requests.beUser, state.entityStore),
      createMakerResponse: get(
        state.entityStore.responses,
        requests.beMakerCreate
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmation: null,
      resetPassword: null
    };
    this.newMaker = this.newMaker.bind(this);
    this.updateMakers = this.updateMakers.bind(this);
  }

  componentDidMount() {
    this.fetchUser(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.fetchUser(nextProps.match.params.id);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush([requests.beUserUpdate, requests.beMakerCreate]));
  }

  fetchUser(id) {
    const call = usersAPI.show(id);
    const userRequest = request(call, requests.beUser);
    this.props.dispatch(userRequest);
  }

  handleUserDestroy(event, user) {
    const heading = "Are you sure you want to delete this user?";
    const message = "This action cannot be undone.";
    new Promise((resolve, reject) => {
      this.setState({
        confirmation: { resolve, reject, heading, message }
      });
    }).then(
      () => {
        this.destroyUser(user);
        this.closeDialog();
      },
      () => {
        this.closeDialog();
      }
    );
  }

  destroyUser(user) {
    const call = usersAPI.destroy(user.id);
    const options = { removes: user };
    const userRequest = request(call, requests.beUserDestroy, options);
    this.props.dispatch(userRequest).promise.then(() => {
      this.props.history.push(lh.link("backendPeopleUsers"));
    });
  }

  closeDialog() {
    this.setState({ confirmation: null });
  }

  closeResetDialog() {
    this.setState({ resetPassword: null });
  }

  updateMakers(makers, changeTypeIgnored) {
    const adjustedMakers = makers.map(e => {
      return {
        id: e.id,
        type: e.type
      };
    });
    const user = {
      type: this.props.user.type,
      id: this.props.user.id,
      relationships: { makers: { data: adjustedMakers } }
    };
    const call = usersAPI.update(user.id, user);
    const makerRequest = request(call, requests.beUserUpdate);
    this.props.dispatch(makerRequest);
  }

  /* Makers only need names, so users can create a new one */
  newMaker(value) {
    const parts = value.split(" ");
    const maker = {
      type: "makers",
      attributes: {
        firstName: parts[0],
        lastName: parts[1]
      }
    };
    const call = makersAPI.create(maker);
    const makerRequest = request(call, requests.beMakerCreate);
    const { promise } = this.props.dispatch(makerRequest);
    return promise;
  }

  handleResetPasswordClick(eventIgnored) {
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
  }

  render() {
    if (!this.props.user) return null;
    const attr = this.props.user.attributes;
    const user = this.props.user;

    return (
      <div>
        {this.state.confirmation ? (
          <Dialog.Confirm {...this.state.confirmation} />
        ) : null}
        {this.state.resetPassword ? (
          <Dialog.ResetPassword
            uiProps={this.state.resetPassword}
            {...this.props}
          />
        ) : null}
        <header className="drawer-header">
          <h2 className="heading-quaternary">
            {`${attr.firstName} ${attr.lastName}`}
          </h2>
          <div className="buttons-bare-vertical">
            <button
              className="button-bare-primary"
              onClick={event =>
                this.handleResetPasswordClick(event, this.props.user)
              }
            >
              {"Reset Password"}
              <i className="manicon manicon-key" />
            </button>
            <br />
            <button
              className="button-bare-primary"
              onClick={event => {
                this.handleUserDestroy(event, this.props.user);
              }}
            >
              {"Delete User"}
              <i className="manicon manicon-trashcan" />
            </button>
          </div>
        </header>
        <section className="form-section">
          <FormContainer.Form
            model={this.props.user}
            name="backend-edit-user"
            update={usersAPI.update}
            create={usersAPI.create}
            className="form-secondary"
          >
            <Form.TextInput
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
                { label: "Reader", value: "reader" }
              ]}
            />
            <Form.Save text="Save User" />
          </FormContainer.Form>
        </section>
        <section className="form-section">
          <form className="form-secondary">
            <FormContainer.UserClaims
              label="Makers"
              placeholder="Add or create a maker"
              onNew={this.newMaker}
              onChange={this.updateMakers}
              api={usersAPI}
              entity={user}
              errors={get(this.props, "createMakerResponse.errors")}
            />
          </form>
        </section>
      </div>
    );
  }
}

export default connectAndFetch(UsersEditContainer);
