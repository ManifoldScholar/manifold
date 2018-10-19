import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { usersAPI, requests } from "api";
import debounce from "lodash/debounce";
import get from "lodash/get";
import { User, List, Layout } from "components/backend";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import config from "../../../config";

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
    this.state = { filter: {} };
    this.lastFetchedPage = null;
    this.fetchUsers = debounce(this.fetchUsers.bind(this), 250, {
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

  maybeReload(prevUsersMeta) {
    const currentModified = get(this.props, "usersMeta.modified");
    const previousModified = get(prevUsersMeta, "modified");
    if (!currentModified) return;
    if (currentModified && previousModified) return;
    this.fetchUsers(this.lastFetchedPage);
  }

  fetchUsers(page) {
    this.lastFetchedPage = page;
    const pagination = { number: page, size: perPage };
    const action = request(
      usersAPI.index(this.state.filter, pagination),
      requests.beUsers
    );
    this.props.dispatch(action);
  }

  filterChangeHandler = filter => {
    this.setState({ filter }, () => {
      this.fetchUsers(1);
    });
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
    const { users, usersMeta, currentUserId } = this.props;
    const active = match.params.id;

    const drawerProps = {
      closeUrl: lh.link("backendRecordsUsers")
    };

    return (
      <div>
        {childRoutes(this.props.route, { drawer: true, drawerProps })}
        <Layout.ViewHeader>{"Manage Users"}</Layout.ViewHeader>
        <Layout.BackendPanel>
          {users ? (
            <List.Searchable
              newButton={{
                path: lh.link("backendRecordsUsersNew"),
                text: "Add a New User",
                authorizedFor: "user"
              }}
              entities={users}
              singularUnit="user"
              pluralUnit="users"
              pagination={usersMeta.pagination}
              paginationClickHandler={this.usersPageChangeHandlerCreator}
              paginationClass="secondary"
              entityComponent={User.ListItem}
              entityComponentProps={{ currentUserId, active }}
              filterChangeHandler={this.filterChangeHandler}
              filterOptions={{
                role: {
                  options: Object.keys(config.app.locale.roles),
                  labels: config.app.locale.roles
                }
              }}
              sortOptions={[
                { label: "first name", value: "first_name" },
                { label: "last name", value: "last_name" }
              ]}
            />
          ) : null}
        </Layout.BackendPanel>
      </div>
    );
  }
}

export default connectAndFetch(UsersListContainer);
