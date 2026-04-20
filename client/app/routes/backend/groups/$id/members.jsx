import { useTranslation } from "react-i18next";
import { useOutletContext, useRevalidator } from "react-router";
import { readingGroupsAPI, readingGroupMembershipsAPI } from "api";
import loadList from "lib/react-router/loaders/loadList";
import { useApiCallback } from "hooks";
import useConfirmation from "hooks/useConfirmation";
import Dialog from "components/global/dialog";
import EntitiesList, {
  ReadingGroupMemberRow
} from "components/backend/list/EntitiesList";

export const loader = async ({ params, request, context }) => {
  return loadList({
    request,
    context,
    fetchFn: (filters, pagination) =>
      readingGroupsAPI.members(params.id, filters, pagination),
    options: {
      defaultFilters: { withUpdateAbility: true },
      defaultPagination: { page: 1, perPage: 20 }
    }
  });
};

export default function GroupMembers({ loaderData }) {
  const { t } = useTranslation();
  const { readingGroup } = useOutletContext() || {};
  const { revalidate } = useRevalidator();
  const { confirm, confirmation } = useConfirmation();

  const { data, meta } = loaderData;

  const deleteMembership = useApiCallback(readingGroupMembershipsAPI.destroy);

  const onDelete = (id, name) => {
    confirm({
      heading: t("modals.delete_membership", { name }),
      message: t("modals.delete_membership_body"),
      callback: async closeDialog => {
        await deleteMembership(id);
        closeDialog();
        revalidate();
      }
    });
  };

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <EntitiesList
        entityComponent={ReadingGroupMemberRow}
        entityComponentProps={{ readingGroup, onDelete }}
        title={t("reading_groups.members_header")}
        titleStyle="bar"
        titleTag="h2"
        entities={data}
        unit={t("glossary.member", {
          count: meta?.pagination?.totalCount || 0
        })}
        pagination={meta?.pagination}
        showCount
      />
    </>
  );
}
