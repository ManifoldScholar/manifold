import React from "react";
import PropTypes from "prop-types";
import { useParams, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  useFetch,
  useApiCallback,
  usePaginationState,
  useSetLocation
} from "hooks";
import { readingGroupsAPI, readingGroupMembershipsAPI } from "api";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import MembersTable from "frontend/components/reading-group/tables/Members";
import * as Styled from "../styles";

import withConfirmation from "hoc/withConfirmation";

function MembersListContainer({ route, dispatch, confirm, readingGroup }) {
  const { id } = useParams();
  const history = useHistory();
  const { t } = useTranslation();

  const [pagination, setPageNumber] = usePaginationState(1, 10);

  const { data: members, meta, refresh } = useFetch({
    request: [readingGroupsAPI.members, id, null, pagination]
  });

  useSetLocation({ page: pagination.number });

  const paginationClickHandlerCreator = page => {
    return event => {
      event.preventDefault();
      setPageNumber(page);
    };
  };

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

  const renderRoutes = () => {
    return childRoutes(route, {
      drawer: true,
      drawerProps: {
        closeUrl: membersRoute,
        context: "frontend",
        size: "wide",
        position: "overlay",
        lockScroll: "always"
      },
      childProps: {
        confirm,
        dispatch,
        readingGroup,
        onRemoveClick: removeMember,
        onEditSuccess: () => history.push(membersRoute)
      }
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
          onPageClick={paginationClickHandlerCreator}
          onRemoveMember={removeMember}
        />
      </Styled.Body>
      {renderRoutes()}
    </>
  );
}

MembersListContainer.displayName = "ReadingGroup.MembersList.Container";

MembersListContainer.propTypes = {
  route: PropTypes.object,
  dispatch: PropTypes.func,
  confirm: PropTypes.func,
  readingGroup: PropTypes.object
};

export default withConfirmation(MembersListContainer);
