import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { userGroupsAPI } from "api";
import lh from "helpers/linkHandler";
import OutletWithDrawers from "global/components/router/OutletWithDrawers";
import EntitiesList, {
  Button,
  UserGroupRow
} from "backend/components/list/EntitiesList";
import withFilteredLists, { userGroupFilters } from "hoc/withFilteredLists";
import { useFetch } from "hooks";

function UserGroupsListContainer() {
  const { t } = useTranslation();

  const { data: userGroups, meta: userGroupsMeta, refresh } = useFetch({
    request: [userGroupsAPI.index],
    options: { requestKey: "backend-user-groups" }
  });

  const drawerProps = {
    closeUrl: lh.link("backendRecordsUserGroups"),
    lockScroll: "always"
  };

  const unit = t("glossary.user_group", {
    count: userGroupsMeta?.pagination?.totalCount
  });

  return (
    <>
      <OutletWithDrawers drawerProps={drawerProps} context={{ refresh }} />
      {userGroups && userGroupsMeta && (
        <EntitiesList
          title={t("records.user_groups.header")}
          titleStyle="bar"
          entities={userGroups}
          entityComponent={UserGroupRow}
          unit={unit}
          pagination={userGroupsMeta.pagination}
          showCount
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
  entitiesListSearchProps: PropTypes.func.isRequired,
  entitiesListSearchParams: PropTypes.object.isRequired
};

export default withFilteredLists(UserGroupsListContainer, {
  user_groups: userGroupFilters()
});
