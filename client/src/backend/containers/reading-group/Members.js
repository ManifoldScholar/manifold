import React, { useMemo } from "react";
import Authorize from "hoc/Authorize";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import { readingGroupsAPI, readingGroupMembershipsAPI } from "api";
import { withRouter } from "react-router-dom";
import { useFetch, usePaginationState, useApiCallback } from "hooks";
import EntitiesList, {
  ReadingGroupMemberRow
} from "backend/components/list/EntitiesList";
import withConfirmation from "hoc/withConfirmation";

function ReadingGroupMembersContainer({
  refresh,
  readingGroup,
  route,
  confirm
}) {
  const closeUrl = lh.link("backendReadingGroupMembers", readingGroup.id);

  const [pagination, setPageNumber] = usePaginationState();

  const filters = useMemo(() => ({ withUpdateAbility: true }), []);

  const { data, refresh: refreshMembers, meta } = useFetch({
    request: [readingGroupsAPI.members, readingGroup.id, filters, pagination]
  });

  const { t } = useTranslation();

  const deleteMembership = useApiCallback(readingGroupMembershipsAPI.destroy);

  const onDelete = (id, name) => {
    const heading = t("modals.delete_membership", { name });
    const message = t("modals.delete_membership_body");
    if (confirm)
      confirm(heading, message, async () => {
        await deleteMembership(id);
        refreshMembers();
      });
  };

  if (!data) return null;

  return (
    <Authorize
      entity={readingGroup}
      ability="update"
      failureNotification
      failureRedirect={lh.link("backendReadingGroups")}
    >
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
        pagination={meta.pagination}
        showCount
        callbacks={{
          onPageClick: page => () => setPageNumber(page)
        }}
      />
      {childRoutes(route, {
        drawer: true,
        drawerProps: {
          lockScroll: "always",
          wide: true,
          lockScrollClickCloses: false,
          closeUrl
        },
        childProps: {
          refresh,
          refreshMembers,
          readingGroup,
          closeUrl: lh.link("backendReadingGroupMembers", readingGroup.id)
        }
      })}
    </Authorize>
  );
}

ReadingGroupMembersContainer.propTypes = {
  readingGroup: PropTypes.object
};

export default withRouter(withConfirmation(ReadingGroupMembersContainer));
