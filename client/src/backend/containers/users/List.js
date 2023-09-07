import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { usersAPI, requests } from "api";
import get from "lodash/get";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import EntitiesList, {
  Button,
  Search,
  UserRow
} from "backend/components/list/EntitiesList";
import withFilteredLists, { userFilters } from "hoc/withFilteredLists";

const { request } = entityStoreActions;
const perPage = 10;

class UsersListContainerImplementation extends PureComponent {
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
    currentUserId: PropTypes.string,
    t: PropTypes.func
  };

  constructor() {
    super();
    this.lastFetchedPage = null;
  }

  componentDidMount() {
    this.fetchUsers(1);
  }

  componentDidUpdate(prevProps) {
    if (this.filtersChanged(prevProps)) return this.fetchUsers();
    if (this.userWasModified(prevProps))
      return this.fetchUsers(this.lastFetchedPage);
  }

  filtersChanged(prevProps) {
    return (
      prevProps.entitiesListSearchParams !== this.props.entitiesListSearchParams
    );
  }

  userWasModified(prevProps) {
    const currentModified = get(this.props, "usersMeta.modified");
    const previousModified = get(prevProps, "usersMeta.modified");
    if (!currentModified) return false;
    return !(currentModified && previousModified);
  }

  fetchUsers = (page = 1) => {
    this.lastFetchedPage = page;
    const pagination = { number: page, size: perPage };
    const filters = this.props.entitiesListSearchParams.users;
    const action = request(
      usersAPI.index(filters, pagination),
      requests.beUsers
    );
    this.props.dispatch(action);
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
    const { match, entitiesListSearchProps, t } = this.props;
    if (!this.props.users) return null;
    const { users, usersMeta } = this.props;
    const active = match.params.id;

    const drawerProps = {
      closeUrl: lh.link("backendRecordsUsers"),
      lockScroll: "always"
    };

    const refetch = () =>
      this.fetchUsers(usersMeta?.pagination?.currentPage ?? 1);

    return (
      <>
        {childRoutes(this.props.route, {
          drawer: true,
          drawerProps,
          childProps: { refetch }
        })}
        <EntitiesList
          entityComponent={UserRow}
          entityComponentProps={{ active }}
          title={t("records.users.header")}
          titleStyle="bar"
          entities={users}
          unit={t("glossary.user", { count: usersMeta.pagination.totalCount })}
          pagination={usersMeta.pagination}
          showCount
          callbacks={{
            onPageClick: this.usersPageChangeHandlerCreator
          }}
          search={<Search {...entitiesListSearchProps("users")} />}
          buttons={[
            <Button
              path={lh.link("backendRecordsUsersNew")}
              text={t("records.users.button_label")}
              authorizedFor="user"
              type="add"
            />
          ]}
        />
      </>
    );
  }
}

export const UsersListContainer = withFilteredLists(
  UsersListContainerImplementation,
  {
    users: userFilters()
  }
);
export default withTranslation()(connectAndFetch(UsersListContainer));
