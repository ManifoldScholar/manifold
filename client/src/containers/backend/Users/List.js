import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { UserList } from 'components/backend';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import usersAPI from 'api/users';
const { select, meta } = entityUtils;
const { request } = entityStoreActions;

const perPage = 20;

class UsersListContainer extends PureComponent {

  static displayName = "Users.List"

  static fetchData(getState, dispatch) {
    const usersRequest =
      request(usersAPI.index({}, { size: perPage }), "backend-users-list");
    return dispatch(usersRequest);
  }

  static mapStateToProps(state) {
    return {
      users: select("backend-users-list", state.entityStore),
      usersMeta: meta("backend-users-list", state.entityStore)
    };
  }

  static propTypes = {
    users: PropTypes.array
  };

  constructor() {
    super();
    this.usersPageChangeHandlerCreator = this.usersPageChangeHandlerCreator.bind(this);
  }

  handleUsersPageChange(event, page) {
    const pagination = { number: page, size: perPage };
    const filter = { };
    const action = request(
      usersAPI.index(filter, pagination),
      'backend-users-list'
    );
    this.props.dispatch(action);
  }

  usersPageChangeHandlerCreator(page) {
    return (event) => {
      this.handleUsersPageChange(event, page);
    };
  }

  render() {
    if (!this.props.users) return null;
    return (
      <div>
        <header className="section-heading-secondary">
          <h3>
            {'Users'} <i className="manicon manicon-users"></i>
          </h3>
        </header>
        { this.props.users ?
          <UserList.SearchableList
            users={this.props.users}
            paginationClickHandler={this.usersPageChangeHandlerCreator}
            pagination={this.props.usersMeta.pagination}
          /> : null
        }
      </div>
    );

  }

}

export default connect(
  UsersListContainer.mapStateToProps
)(UsersListContainer);

