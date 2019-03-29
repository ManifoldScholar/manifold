import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { usersAPI, requests } from "api";
import debounce from "lodash/debounce";
import get from "lodash/get";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import config from "config";
import EntitiesList, {
  Button,
  Search,
  UserRow
} from "backend/components/list/EntitiesList";
import isEqual from "lodash/isEqual";

const { request } = entityStoreActions;
const perPage = 10;

export class UsersListContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      users: select(requests.beUsers, state.entityStore),
      usersMeta: meta(requests.beUsers, state.entityStore),
      currentUserId: get(state, "authentication.currentUser.id")
    };
  };

  static displayName = "Users.List";

  static propTypes = {
    users: PropTypes.array,
    usersMeta: PropTypes.object,
    match: PropTypes.object,
    route: PropTypes.object,
    dispatch: PropTypes.func,
    currentUserId: PropTypes.string
  };

  constructor() {
    super();
    this.lastFetchedPage = null;
    this.state = { filter: this.defaultFilter };
    this.fetchUsers = debounce(this.fetchUsers, 250, {
      leading: false,
      trailing: true
    });
  }

  componentDidMount() {
    this.fetchUsers();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.shouldReload(prevProps.usersMeta)) {
      return this.fetchUsers(this.lastFetchedPage);
    }

    if (this.shouldFetch(prevState)) {
      return this.fetchUsers();
    }
  }

  get roleOptions() {
    const roles = Object.keys(config.app.locale.roles);
    const labels = config.app.locale.roles;
    return roles.map(role => {
      return {
        label: labels[role],
        value: role
      };
    });
  }

  get defaultFilter() {
    return { order: "last_name" };
  }

  shouldReload(prevUsersMeta) {
    const currentModified = get(this.props, "usersMeta.modified");
    const previousModified = get(prevUsersMeta, "modified");
    if (!currentModified) return;
    return currentModified || previousModified;
  }

  shouldFetch(prevState) {
    return !isEqual(prevState.filter, this.state.filter);
  }

  fetchUsers = (page = 1) => {
    this.lastFetchedPage = page;
    const pagination = { number: page, size: perPage };
    const action = request(
      usersAPI.index(this.state.filter, pagination),
      requests.beUsers
    );
    this.props.dispatch(action);
  };

  filterChangeHandler = filter => {
    this.setState({ filter });
  };

  usersPageChangeHandlerCreator = page => {
    return () => this.fetchUsers(page);
  };

  resetSearch = () => {
    this.setState({ filter: this.defaultFilter });
  };

  render() {
    const { match } = this.props;
    if (!this.props.users) return null;
    const { users, usersMeta } = this.props;
    const active = match.params.id;

    const drawerProps = {
      closeUrl: lh.link("backendRecordsUsers")
    };

    return (
      <React.Fragment>
        {childRoutes(this.props.route, { drawer: true, drawerProps })}
        <EntitiesList
          entityComponent={UserRow}
          entityComponentProps={{ active }}
          title={"Manage Users"}
          titleStyle="bar"
          entities={users}
          unit="user"
          pagination={usersMeta.pagination}
          showCount
          callbacks={{
            onPageClick: this.usersPageChangeHandlerCreator
          }}
          search={
            <Search
              filter={this.state.filter}
              reset={this.resetSearch}
              sortOptions={[
                { label: "last name", value: "last_name" },
                { label: "first name", value: "first_name" }
              ]}
              onChange={this.filterChangeHandler}
              filters={[
                {
                  label: "Role",
                  key: "role",
                  options: this.roleOptions
                }
              ]}
            />
          }
          buttons={[
            <Button
              path={lh.link("backendRecordsUsersNew")}
              text="Add a new user"
              authorizedFor="user"
              type="add"
            />
          ]}
        />
      </React.Fragment>
    );
  }
}

export default connectAndFetch(UsersListContainer);
