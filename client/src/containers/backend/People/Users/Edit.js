import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Drawer, Dialog } from 'components/backend';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { usersAPI, makersAPI, requests } from 'api';
const { select } = entityUtils;
import { Form } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import { browserHistory } from 'react-router';
import get from 'lodash/get';
const { request, flush } = entityStoreActions;

class UsersEditContainer extends PureComponent {

  static displayName = "Users.Edit";

  static mapStateToProps(state, ownProps) {
    return {
      user: select(requests.beUser, state.entityStore),
      createMakerResponse: get(state.entityStore.responses, requests.beMakerCreate)
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      confirmation: null
    };
    this.newMaker = this.newMaker.bind(this);
    this.updateMakers = this.updateMakers.bind(this);
  }

  componentDidMount() {
    this.fetchUser(this.props.params.id);
  }

  componentWillUnmount() {
    this.props.dispatch(flush([
      requests.beUserUpdate, requests.beMakerCreate
    ]));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.id !== this.props.params.id) this.fetchUser(nextProps.params.id);
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
    }).then(() => {
      this.destroyUser(user);
      this.closeDialog();
    }, () => { this.closeDialog(); });
  }

  destroyUser(user) {
    const call = usersAPI.destroy(user.id);
    const options = { removes: user };
    const userRequest = request(call, requests.beUserDestroy, options);
    this.props.dispatch(userRequest).promise.then(() => {
      browserHistory.push('/backend/people/users');
    });
  }

  closeDialog() {
    this.setState({ confirmation: null });
  }

  updateMakers(makers, changeType) {
    const adjustedMakers = makers.map((e) => {
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
    const parts = value.split(' ');
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

  render() {
    if (!this.props.user) return null;
    const attr = this.props.user.attributes;
    const user = this.props.user;
    /*
      Edit dialog(s) can be wrapped in either
      <Drawer.Wrapper>: Right-hand pop-in panel
      <Dialog.Wrapper> Overlay with dialog box
    */
    return (
      <Drawer.Wrapper
        closeUrl="/backend/people/users"
      >
        {
          this.state.confirmation ?
            <Dialog.Confirm {...this.state.confirmation} />
            : null
        }
        <header className="drawer-header">
          <h2 className="heading-quaternary">
            {`${attr.firstName} ${attr.lastName}`}
          </h2>
          <div className="buttons-bare-vertical">
            <button className="button-bare-primary">
              {'Reset Password'}
              <i className="manicon manicon-key"></i>
            </button><br/>
            <button
              className="button-bare-primary"
              onClick={(event) => { this.handleUserDestroy(event, this.props.user); }}
            >
              {'Delete User'}
              <i className="manicon manicon-trashcan"></i>
            </button>
          </div>
        </header>

        <FormContainer.Form
          route={this.props.routes[this.props.routes.length - 1]}
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
          <Form.Save
            text="Save User"
          />
        </FormContainer.Form>
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
      </Drawer.Wrapper>
    );
  }

}

export default connect(
  UsersEditContainer.mapStateToProps
)(UsersEditContainer);
