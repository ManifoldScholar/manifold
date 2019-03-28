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
    this.fetchUsers = debounce(this.fetchUsers, 250, {
      leading: false,
      trailing: true
    });
  }

  componentDidMount() {
    this.fetchUsers(1);
  }

  componentDidUpdate(prevProps) {
    this.maybeReload(prevProps.usersMeta);
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

  maybeReload(prevUsersMeta) {
    const currentModified = get(this.props, "usersMeta.modified");
    const previousModified = get(prevUsersMeta, "modified");
    if (!currentModified) return;
    if (currentModified && previousModified) return;
    this.fetchUsers(this.lastFetchedPage);
  }

  fetchUsers = (page, filter = {}) => {
    this.lastFetchedPage = page;
    const pagination = { number: page, size: perPage };
    const filterParams = Object.assign({}, this.defaultFilter, filter);
    const action = request(
      usersAPI.index(filterParams, pagination),
      requests.beUsers
    );
    this.props.dispatch(action);
  };

  filterChangeHandler = filter => {
    this.fetchUsers(1, filter);
  };

  handleUsersPageChange(event, page) {
    this.fetchUsers(page);
  }

  usersPageChangeHandlerCreator = page => {
    return event => {
      this.handleUsersPageChange(event, page);
    };
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
              sortOptions={[
                { label: "first name", value: "first_name" },
                { label: "last name", value: "last_name" }
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
              text="Add a New User"
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
