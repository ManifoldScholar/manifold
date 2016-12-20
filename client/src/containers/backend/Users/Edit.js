import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Drawer } from 'components/backend';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import usersAPI from 'api/users';
const { select, meta } = entityUtils;
const { request } = entityStoreActions;
import { Form } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';

class UserEditContainer extends PureComponent {

  static displayName = "User.Edit"

  static mapStateToProps(state, ownProps) {
    return {
      user: select('backend-edit-user', state.entityStore)
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

  render() {
    if (!this.props.user) return null;
    return (
      <Drawer.Wrapper closeUrl="/backend/users" >
        <FormContainer.Form
          route={this.props.routes[this.props.routes.length - 1]}
          model={this.props.user}
          name="backend-edit-user"
          update={usersAPI.update}
          create={usersAPI.create}
          className="form-secondary"
        >
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
        </FormContainer.Form>
      </Drawer.Wrapper>
    )
  }

}

export default connect(
  UserEditContainer.mapStateToProps
)(UserEditContainer);
