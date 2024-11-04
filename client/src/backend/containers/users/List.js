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
import { useListQueryParams, useFetch } from "hooks";
import { useParams } from "react-router-dom";

function UsersListContainer({
  entitiesListSearchProps,
  entitiesListSearchParams,
  route
}) {
  const { t } = useTranslation();
  const { id } = useParams();

  const { pagination, filters, searchProps } = useListQueryParams({
    initSize: 10,
    initFilters: entitiesListSearchParams.users,
    initSearchProps: entitiesListSearchProps("users")
  });

  const { data: users, meta: usersMeta, refresh } = useFetch({
    request: [usersAPI.index, filters, pagination],
    options: { requestKey: requests.beUsers }
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
        search={<Search {...searchProps} />}
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

UsersListContainer.displayName = "Users.List";

UsersListContainer.propTypes = {
  route: PropTypes.object
};

export default withFilteredLists(UsersListContainer, {
  users: userFilters()
});
