import { useCallback } from "react";
import { useOutletContext, useParams } from "react-router";
import { useRevalidator } from "react-router";
import { redirect } from "react-router";
import { readingGroupsAPI, readingGroupMembershipsAPI } from "api";
import createListClientLoader from "lib/react-router/loaders/createListClientLoader";
import loadList from "lib/react-router/loaders/loadList";
import { useApiCallback, useConfirmation } from "hooks";
import { useTranslation } from "react-i18next";
import Dialog from "components/global/dialog";
import MembersTable from "components/frontend/reading-group/tables/Members";
import OutletWithDrawers from "components/global/router/OutletWithDrawers";
import * as Styled from "./styles";

const DEFAULT_PAGINATION = { page: 1, perPage: 10 };

export const loader = async ({ params, request, context }) => {
  return loadList({
    request,
    context,
    fetchFn: (filters, pagination) =>
      readingGroupsAPI.members(params.id, filters, pagination),
    options: { defaultPagination: DEFAULT_PAGINATION }
  });
};

export const clientLoader = ({ params, request, serverLoader }) => {
  const fetchFn = (filters, pagination) =>
    readingGroupsAPI.members(params.id, filters, pagination);

  const clientLoaderFn = createListClientLoader({
    hydrateKey: "__readingGroupMembersHydrated",
    fetchFn,
    options: { defaultPagination: DEFAULT_PAGINATION }
  });

  return clientLoaderFn({ request, serverLoader });
};

function ReadingGroupMembersRoute({ loaderData }) {
  const { data: members = [], meta } = loaderData;
  const readingGroup = useOutletContext();
  const { abilities, currentUserRole } = readingGroup.attributes || {};
  const userIsGroupMember = abilities?.update || currentUserRole !== "none";
  if (!userIsGroupMember) throw redirect(`/groups/${readingGroup.id}`);

  const { id } = useParams();
  const { revalidate } = useRevalidator();
  const { t } = useTranslation();
  const { confirm, confirmation } = useConfirmation();
  const destroyMembership = useApiCallback(readingGroupMembershipsAPI.destroy);

  const removeMember = useCallback(
    membership => {
      const heading = t("messages.membership.destroy_heading");
      const message = t("messages.membership.destroy_message");
      confirm({
        heading,
        message,
        callback: async closeDialog => {
          try {
            await destroyMembership(membership.id);
            revalidate();
            closeDialog();
          } catch (err) {
            console.error(err);
          }
        }
      });
    },
    [confirm, t, revalidate, destroyMembership]
  );

  const closeUrl = `/groups/${id}/members`;

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <Styled.Body>
        <MembersTable
          readingGroup={readingGroup}
          members={members}
          pagination={meta?.pagination}
          onRemoveMember={removeMember}
        />
      </Styled.Body>
      <OutletWithDrawers
        drawerProps={{
          closeUrl,
          context: "frontend",
          size: "wide",
          position: "overlay",
          lockScroll: "always"
        }}
        context={readingGroup}
      />
    </>
  );
}

export default ReadingGroupMembersRoute;
