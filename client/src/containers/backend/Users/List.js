import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { UserList } from 'components/backend';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import usersAPI from 'api/users';
import debounce from 'lodash/debounce';
import get from 'lodash/get';

const { select, meta } = entityUtils;
const { request } = entityStoreActions;
const perPage = 20;

class UsersListContainer extends PureComponent {

  static displayName = "Users.List"

  static mapStateToProps(state) {
    return {
      users: select("backend-users-list", state.entityStore),
      usersMeta: meta("backend-users-list", state.entityStore),
      currentUserId: get(state, 'authentication.currentUser.id')
    };
  }

  static propTypes = {
    users: PropTypes.array
  };

  constructor() {
    super();
    this.state = { filter: {} };
    this.usersPageChangeHandlerCreator = this.usersPageChangeHandlerCreator.bind(this);
    this.fetchUsers = debounce(
      this.fetchUsers.bind(this), 250, { leading: false, trailing: true }
      );
    this.filterChangeHandler = this.filterChangeHandler.bind(this);
  }

  componentDidMount() {
    this.fetchUsers(1);
  }

  fetchUsers(page) {
    const pagination = { number: page, size: perPage };
    const action = request(
      usersAPI.index(this.state.filter, pagination),
      'backend-users-list'
    );
    this.props.dispatch(action);
  }

  filterChangeHandler(filter) {
    this.setState({ filter }, () => {
      this.fetchUsers(1);
    });
  }

  handleUsersPageChange(event, page) {
    this.fetchUsers(page);
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
        { this.props.children }
        { this.props.users ?
          <UserList.SearchableList
            users={this.props.users}
            active={this.props.params.id}
            filterChangeHandler={this.filterChangeHandler}
            paginationClickHandler={this.usersPageChangeHandlerCreator}
            pagination={this.props.usersMeta.pagination}
            currentUserId={this.props.currentUserId}
          /> : null
        }
      </div>
    );

  }

}

export default connect(
  UsersListContainer.mapStateToProps
)(UsersListContainer);

