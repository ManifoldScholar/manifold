import { useCallback } from "react";
import { useOutletContext, useNavigate, useParams } from "react-router";
import { useRevalidator } from "react-router";
import { redirect } from "react-router";
import { readingGroupsAPI, readingGroupMembershipsAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import createListClientLoader from "app/routes/utility/loaders/createListClientLoader";
import loadList from "app/routes/utility/loaders/loadList";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import { useConfirmation } from "hooks";
import { useTranslation } from "react-i18next";
import Dialog from "global/components/dialog";
import MembersTable from "frontend/components/reading-group/tables/Members";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import * as Styled from "./styles";

const DEFAULT_PAGINATION = { page: 1, perPage: 10 };

export const loader = async ({ params, request, context }) => {
  const fetchFn = () => readingGroupsAPI.show(params.id);
  const readingGroup = await loadEntity({ context, fetchFn });

  const { abilities, currentUserRole } = readingGroup.attributes || {};
  const canUpdateGroup = abilities?.update;
  const userIsGroupMember = canUpdateGroup || currentUserRole !== "none";

  if (!userIsGroupMember) {
    throw redirect(`/groups/${params.id}`);
  }

  const membersFetchFn = (filters, pagination) =>
    readingGroupsAPI.members(params.id, filters, pagination);

  return loadList({
    request,
    context,
    fetchFn: membersFetchFn,
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
  const { id } = useParams();
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();
  const { t } = useTranslation();
  const { confirm, confirmation } = useConfirmation();

  const removeMember = useCallback(
    membership => {
      const heading = t("messages.membership.destroy_heading");
      const message = t("messages.membership.destroy_message");
      confirm({
        heading,
        message,
        callback: async closeDialog => {
          try {
            await queryApi(readingGroupMembershipsAPI.destroy(membership.id));
            revalidate();
            closeDialog();
          } catch (err) {
            console.error(err);
          }
        }
      });
    },
    [confirm, t, revalidate]
  );

  const closeUrl = `/groups/${id}/members`;
  const handleCloseDrawer = () => navigate(closeUrl);

  const handleEditSuccess = () => {
    revalidate();
    handleCloseDrawer();
  };

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
      <OutletWithDrawer
        drawerProps={{
          closeUrl,
          context: "frontend",
          size: "wide",
          position: "overlay",
          lockScroll: "always"
        }}
        context={{
          readingGroup,
          closeDrawer: handleCloseDrawer,
          onEditSuccess: handleEditSuccess
        }}
      />
    </>
  );
}

export default ReadingGroupMembersRoute;
