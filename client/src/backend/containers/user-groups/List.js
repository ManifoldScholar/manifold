import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { userGroupsAPI } from "api";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import EntitiesList, {
  Button,
  Search,
  UserGroupRow
} from "backend/components/list/EntitiesList";
import withFilteredLists, { userGroupFilters } from "hoc/withFilteredLists";
import { useListQueryParams, useFetch } from "hooks";

function UserGroupsListContainer({
  route: baseRoute,
  entitiesListSearchProps,
  entitiesListSearchParams
}) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const id = pathname.split("/")[4];

  const { pagination, filters, searchProps } = useListQueryParams({
    initSize: 10,
    initFilters: entitiesListSearchParams.user_groups,
    initSearchProps: entitiesListSearchProps("user_groups")
  });

  const { data: userGroups, meta: userGroupsMeta } = useFetch({
    request: [userGroupsAPI.index, filters, pagination]
  });

  const drawerProps = {
    closeUrl: lh.link("backendRecordsUserGroups"),
    lockScroll: "always"
  };

  const renderChildRoutes = () => {
    const { routes, ...route } = baseRoute;
    const drawerRoutes = {
      ...route,
      routes: [routes.find(r => r.name === "backendRecordsUserGroupsNew")]
    };
    const detailRoutes = {
      ...route,
      routes: [routes.find(r => r.name === "backendRecordsUserGroup")]
    };
    return (
      <>
        {childRoutes(detailRoutes)}
        {childRoutes(drawerRoutes, {
          drawer: true,
          drawerProps
        })}
      </>
    );
  };

  const showList = !id || id === "new";

  if (showList && (!userGroups || !userGroupsMeta)) return null;

  const unit = t("glossary.user_group", {
    count: userGroupsMeta?.pagination?.totalCount
  });

  return (
    <>
      {renderChildRoutes()}
      {showList && (
        <EntitiesList
          title={t("records.user_groups.header")}
          titleStyle="bar"
          entities={userGroups}
          entityComponent={UserGroupRow}
          unit={unit}
          pagination={userGroupsMeta.pagination}
          showCount
          search={<Search {...searchProps} />}
          buttons={[
            <Button
              path={lh.link("backendRecordsUserGroupsNew")}
              text={t("records.user_groups.button_label")}
              type="add"
              authorizedFor="userGroup"
            />
          ]}
        />
      )}
    </>
  );
}

UserGroupsListContainer.displayName = "UserGroups.List";

UserGroupsListContainer.propTypes = {
  route: PropTypes.object,
  entitiesListSearchProps: PropTypes.func.isRequired,
  entitiesListSearchParams: PropTypes.object.isRequired
};

export default withFilteredLists(UserGroupsListContainer, {
  user_groups: userGroupFilters()
});
