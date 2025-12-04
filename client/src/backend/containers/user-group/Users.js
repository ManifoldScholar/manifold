import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usersAPI, userGroupMembershipsAPI, userGroupsAPI } from "api";
import EntitiesList, {
  UserRow,
  Search
} from "backend/components/list/EntitiesList";
import { useListQueryParams, useFetch, useApiCallback } from "hooks";
import withFilteredLists, { userFilters } from "hoc/withFilteredLists";
import withConfirmation from "hoc/withConfirmation";

const MEMBER_FILTERS = {};

function UserGroupUsers({
  userGroup,
  entitiesListSearchProps,
  entitiesListSearchParams,
  confirm
}) {
  const { t } = useTranslation();

  const [allVisible, setAllVisible] = useState(false);

  const { pagination, filters, searchProps } = useListQueryParams({
    initSize: 10,
    initFilters: entitiesListSearchParams.users,
    initSearchProps: entitiesListSearchProps("users")
  });

  const {
    pagination: membersPagination,
    membersSearchProps
  } = useListQueryParams({
    initSize: 10
  });

  const { data: users, meta: usersMeta } = useFetch({
    request: [usersAPI.index, filters, pagination],
    condition: allVisible
  });

  const {
    data: members,
    meta: membersMeta,
    refresh: refreshMembers
  } = useFetch({
    request: [
      userGroupsAPI.members,
      userGroup.id,
      MEMBER_FILTERS,
      membersPagination
    ],
    condition: !allVisible
  });

  const unit = t("glossary.user", { count: usersMeta?.pagination?.totalCount });

  const createMembership = useApiCallback(userGroupMembershipsAPI.create);
  const destroyMembership = useApiCallback(userGroupMembershipsAPI.destroy);

  const toggleLabel = !allVisible ? "Add Members" : "Show Members Only";

  const onAddMember = async (id, name) => {
    const heading = t("modals.add_auth_membership", { name });
    const message = t("modals.add_auth_membership_body");
    if (confirm)
      confirm(heading, message, async () => {
        await createMembership({ id, userGroupId: userGroup.id });
        refreshMembers();
      });
  };

  const onRemoveMember = (id, name) => {
    const heading = t("modals.delete_auth_membership", { name });
    const message = t("modals.delete_auth_membership_body");
    if (confirm)
      confirm(heading, message, async () => {
        await destroyMembership({ id, userGroupId: userGroup.id });
        refreshMembers();
      });
  };

  const canRender = allVisible
    ? !!users && !!usersMeta
    : !!members && !!membersMeta;

  const memberUsers = members?.map(m => m.relationships?.user);

  return canRender ? (
    <div>
      <EntitiesList
        title={t("records.user_groups.users.header")}
        titleStyle="bar"
        titleActions={[
          {
            label: toggleLabel,
            onClick: () => setAllVisible(!allVisible),
            icon: !allVisible ? "circlePlus24" : "circleMinus24"
          }
        ]}
        entityComponent={UserRow}
        entityComponentProps={{
          membersView: !allVisible,
          groupAction: allVisible ? onAddMember : onRemoveMember,
          groupActionIcon: allVisible ? "circlePlus24" : "circleMinus24",
          memberIds: memberUsers?.map(m => m.id)
        }}
        entities={allVisible ? users : memberUsers}
        unit={unit}
        pagination={allVisible ? usersMeta.pagination : membersMeta.pagination}
        showCount={allVisible}
        search={<Search {...(allVisible ? searchProps : membersSearchProps)} />}
      />
    </div>
  ) : null;
}

export default withFilteredLists(withConfirmation(UserGroupUsers), {
  users: userFilters()
});
