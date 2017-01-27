import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Drawer, Dialog } from 'components/backend';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import usersAPI from 'api/users';
const { select, meta } = entityUtils;
const { request } = entityStoreActions;
import { Form } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import { browserHistory } from 'react-router';

class UserEditContainer extends PureComponent {

  static displayName = "User.Edit"

  static mapStateToProps(state, ownProps) {
    return {
      user: select('backend-edit-user', state.entityStore)
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      confirmation: null
    };
  }

  componentDidMount() {
    this.fetchUser(this.props.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.id !== this.props.params.id) this.fetchUser(nextProps.params.id);
  }

  fetchUser(id) {
    const call = usersAPI.show(id);
    const userRequest = request(call, 'backend-edit-user');
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
    const userRequest = request(call, 'backend-destroy-user', options);
    this.props.dispatch(userRequest).promise.then(() => {
      browserHistory.push('/backend/users');
    });
  }

  closeDialog() {
    this.setState({ confirmation: null });
  }

  render() {
    if (!this.props.user) return null;
    const attr = this.props.user.attributes;

    /*
      Edit dialog(s) can be wrapped in either
      <Drawer.Wrapper>: Right-hand pop-in panel
      <Dialog.Wrapper> Overlay with dialog box
    */
    return (
      <Drawer.Wrapper
        closeUrl="/backend/users"
      >
        {
          this.state.confirmation ?
            <Dialog.Confirm {...this.state.confirmation} />
            : null
        }
        <header>
          {/*
            Dialog/Drawers can use p.utility-primary or h*.heading-quaternary
            shared elements for headers

            Example:
           <p className="utility-primary">
             STEP 1 of 8 – basic information
           </p>

           <h2 className="heading-quaternary">
             {`${attr.firstName} ${attr.lastName}`}
           </h2>
          */}
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
      </Drawer.Wrapper>
    );
  }

}

export default connect(
  UserEditContainer.mapStateToProps
)(UserEditContainer);
