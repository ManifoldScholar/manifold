import { useImperativeHandle, forwardRef } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFetch, useApiCallback, useListQueryParams } from "hooks";
import { readingGroupsAPI, readingGroupMembershipsAPI } from "api";
import MembersTable from "frontend/components/reading-group/tables/Members";
import * as Styled from "../styles";

const MembersListContainer = forwardRef((props, ref) => {
  const { confirm, readingGroup } = props;
  const { id } = useParams();
  const { t } = useTranslation();

  const { pagination } = useListQueryParams({ initSize: 10 });

  const { data: members, meta, refresh } = useFetch({
    request: [readingGroupsAPI.members, id, null, pagination]
  });

  const deleteMembership = useApiCallback(readingGroupMembershipsAPI.destroy);

  const removeMember = membership => {
    const heading = t("messages.membership.destroy_heading");
    const message = t("messages.membership.destroy_message");
    if (confirm)
      confirm(heading, message, () => {
        deleteMembership(membership.id).then(() => refresh());
      });
  };

  // Expose refresh function to parent via ref
  useImperativeHandle(ref, () => ({
    refresh
  }));

  if (!members) return null;

  return (
    <Styled.Body>
      <MembersTable
        readingGroup={readingGroup}
        members={members}
        pagination={meta.pagination}
        onRemoveMember={removeMember}
      />
    </Styled.Body>
  );
});

MembersListContainer.displayName = "ReadingGroup.MembersList.Container";

export default MembersListContainer;
