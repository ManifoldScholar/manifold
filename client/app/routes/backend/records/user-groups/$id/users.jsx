import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useRevalidator } from "react-router";
import { usersAPI, userGroupMembershipsAPI, userGroupsAPI } from "api";
import loadList from "lib/react-router/loaders/loadList";
import {
  useListQueryParams,
  useFetch,
  useApiCallback,
  useConfirmation
} from "hooks";
import Dialog from "components/global/dialog";
import EntitiesList, {
  UserRow,
  Search
} from "components/backend/list/EntitiesList";
import { INIT_FILTERS, INIT_SEARCH_PROPS } from "../../users/filters";

export const loader = async ({ params, url, context }) => {
  return loadList({
    url,
    context,
    fetchFn: () => userGroupsAPI.members(params.id),
    options: { skipFilters: true, skipPagination: true }
  });
};

export default function UserGroupUsersRoute({ loaderData }) {
  const { t } = useTranslation();
  const { userGroup } = useOutletContext();
  const { revalidate } = useRevalidator();
  const { confirm, confirmation } = useConfirmation();

  const [allVisible, setAllVisible] = useState(false);

  const { pagination, filters, searchProps } = useListQueryParams({
    initSize: 10,
    initFilters: INIT_FILTERS,
    initSearchProps: INIT_SEARCH_PROPS
  });

  const { data: users, meta: usersMeta } = useFetch(
    () => usersAPI.index(filters, pagination),
    [filters, pagination],
    { condition: allVisible }
  );

  const { data: members, meta: membersMeta } = loaderData;

  const createMembership = useApiCallback(userGroupMembershipsAPI.create);
  const destroyMembership = useApiCallback(userGroupMembershipsAPI.destroy);

  const onAddMember = (id, name) => {
    confirm({
      heading: t("modals.add_auth_membership", {
        name,
        group: userGroup.attributes.name
      }),
      message: t("modals.add_auth_membership_body"),
      callback: async closeDialog => {
        await createMembership({ id, userGroupId: userGroup.id });
        closeDialog();
        revalidate();
      }
    });
  };

  const onRemoveMember = (id, name) => {
    confirm({
      heading: t("modals.delete_auth_membership", { name }),
      message: t("modals.delete_auth_membership_body"),
      callback: async closeDialog => {
        await destroyMembership({ id, userGroupId: userGroup.id });
        closeDialog();
        revalidate();
      }
    });
  };

  const memberUsers = members?.map(m => ({
    ...m.relationships?.user,
    membershipId: m.id
  }));

  const canRender = allVisible ? !!users && !!usersMeta : !!members;

  const toggleLabel = allVisible
    ? t("records.user_groups.users.show_members_label")
    : t("records.user_groups.users.add_members_label");

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      {canRender && (
        <EntitiesList
          title={t("records.user_groups.users.header")}
          titleStyle="bar"
          titleActions={[
            {
              label: toggleLabel,
              onClick: () => setAllVisible(!allVisible),
              icon: allVisible ? "circleMinus24" : "circlePlus24"
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
          unit={t("glossary.user", {
            count: usersMeta?.pagination?.totalCount
          })}
          pagination={
            allVisible ? usersMeta?.pagination : membersMeta?.pagination
          }
          showCount={allVisible}
          search={allVisible ? <Search {...searchProps} /> : undefined}
        />
      )}
    </>
  );
}
