import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { usersAPI, requests } from "api";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import EntitiesList, {
  Button,
  Search,
  UserRow
} from "backend/components/list/EntitiesList";
import withFilteredLists, { userFilters } from "hoc/withFilteredLists";
import { usePaginationState, useSetLocation, useFetch } from "hooks";
import { useParams } from "react-router-dom";

function UsersListContainer({
  entitiesListSearchProps,
  entitiesListSearchParams,
  route
}) {
  const { t } = useTranslation();
  const { id } = useParams();

  const [pagination, setPageNumber] = usePaginationState(1, 10);

  const { data: users, meta: usersMeta, refresh } = useFetch({
    request: [usersAPI.index, entitiesListSearchParams.users, pagination],
    options: { requestKey: requests.beUsers }
  });

  useSetLocation({
    filters: entitiesListSearchParams.users,
    page: pagination.number
  });

  if (!users || !usersMeta) return null;

  const drawerProps = {
    closeUrl: lh.link("backendRecordsUsers"),
    lockScroll: "always"
  };

  return (
    <>
      {childRoutes(route, {
        drawer: true,
        drawerProps,
        childProps: { refetch: refresh }
      })}
      <EntitiesList
        entityComponent={UserRow}
        entityComponentProps={{ active: id }}
        title={t("records.users.header")}
        titleStyle="bar"
        entities={users}
        unit={t("glossary.user", { count: usersMeta.pagination.totalCount })}
        pagination={usersMeta.pagination}
        showCount
        callbacks={{
          onPageClick: page => e => {
            e.preventDefault();
            setPageNumber(page);
          }
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
        usesQueryParams
      />
    </>
  );
}

UsersListContainer.displayName = "Users.List";

UsersListContainer.propTypes = {
  route: PropTypes.object
};

export default withFilteredLists(UsersListContainer, {
  users: userFilters()
});
