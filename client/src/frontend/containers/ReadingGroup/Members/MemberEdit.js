import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useParams, useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { readingGroupMembershipsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import Layout from "backend/components/layout";
import { MemberSettingsForm } from "frontend/components/reading-group/forms";
import { useFetch } from "hooks";

const { flush } = entityStoreActions;

function ReadingGroupMemberEditContainer() {
  const { membershipId } = useParams();
  const { readingGroup, confirm, dispatch, onRemoveClick, onEditSuccess } =
    useOutletContext() || {};
  const { t } = useTranslation();

  const { data: membership } = useFetch({
    request: [readingGroupMembershipsAPI.show, membershipId]
  });

  useEffect(() => {
    return () => dispatch(flush([requests.feReadingGroupMembershipShow]));
  }, [dispatch]);

  return membership ? (
    <section>
      <Layout.DrawerHeader
        title={t("forms.reading_group_member.title")}
        buttons={[
          {
            onClick: () => onRemoveClick(membership),
            icon: "delete24",
            label: t("actions.delete"),
            className: "utility-button__icon utility-button__icon--notice"
          }
        ]}
        buttonLayout="inline"
        small
      />
      <MemberSettingsForm
        membership={membership}
        readingGroup={readingGroup}
        confirm={confirm}
        onSuccess={onEditSuccess}
      />
    </section>
  ) : null;
}

export default ReadingGroupMemberEditContainer;
