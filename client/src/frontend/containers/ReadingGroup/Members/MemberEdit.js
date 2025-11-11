import { useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { readingGroupMembershipsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import Layout from "backend/components/layout";
import { MemberSettingsForm } from "frontend/components/reading-group/forms";
import { useFetch, useApiCallback } from "hooks";

const { flush } = entityStoreActions;

function ReadingGroupMemberEditContainer() {
  const { membershipId } = useParams();
  const { readingGroup, confirm, onEditSuccess } = useOutletContext() || {};
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { data: membership } = useFetch({
    request: [readingGroupMembershipsAPI.show, membershipId]
  });

  const deleteMembership = useApiCallback(readingGroupMembershipsAPI.destroy);

  useEffect(() => {
    return () => dispatch(flush([requests.feReadingGroupMembershipShow]));
  }, [dispatch]);

  const handleRemove = () => {
    const heading = t("messages.membership.destroy_heading");
    const message = t("messages.membership.destroy_message");
    if (confirm)
      confirm(heading, message, async () => {
        await deleteMembership(membership.id);
        onEditSuccess();
      });
  };

  return membership ? (
    <section>
      <Layout.DrawerHeader
        title={t("forms.reading_group_member.title")}
        buttons={[
          {
            onClick: handleRemove,
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
