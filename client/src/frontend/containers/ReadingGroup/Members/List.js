import React from "react";
import PropTypes from "prop-types";
import { useParams, useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFetch, useApiCallback, useListQueryParams } from "hooks";
import { readingGroupsAPI, readingGroupMembershipsAPI } from "api";
import lh from "helpers/linkHandler";
import OutletWithDrawer from "frontend/components/OutletWithDrawer";
import MembersTable from "frontend/components/reading-group/tables/Members";
import * as Styled from "../styles";

import withConfirmation from "hoc/withConfirmation";

function MembersListContainer() {
  const { dispatch, confirm, readingGroup } = useOutletContext() || {};
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { pagination } = useListQueryParams({ initSize: 10 });

  const { data: members, meta, refresh } = useFetch({
    request: [readingGroupsAPI.members, id, null, pagination]
  });

  const membersRoute = lh.link("frontendReadingGroupMembers", readingGroup.id);

  const deleteMembership = useApiCallback(readingGroupMembershipsAPI.destroy);

  const removeMember = membership => {
    const heading = t("messages.membership.destroy_heading");
    const message = t("messages.membership.destroy_message");
    if (confirm)
      confirm(heading, message, () => {
        deleteMembership(membership.id).then(refresh());
      });
  };

  if (!members) return null;

  return (
    <>
      <Styled.Body>
        <MembersTable
          readingGroup={readingGroup}
          members={members}
          pagination={meta.pagination}
          onRemoveMember={removeMember}
        />
      </Styled.Body>
      <OutletWithDrawer
        drawerProps={{
          closeUrl: membersRoute,
          context: "frontend",
          size: "wide",
          position: "overlay",
          lockScroll: "always"
        }}
        context={{
          confirm,
          dispatch,
          readingGroup,
          onRemoveClick: removeMember,
          onEditSuccess: () => navigate(membersRoute)
        }}
      />
    </>
  );
}

MembersListContainer.displayName = "ReadingGroup.MembersList.Container";

export default withConfirmation(MembersListContainer);
